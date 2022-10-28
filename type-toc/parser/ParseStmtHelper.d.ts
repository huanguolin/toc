import { ErrorResult, NoWay, SuccessResult } from "../Result";
import { BuildToken, EOF, Token } from "../scanner/Token";
import { Push } from "../utils/array";

import { Expr } from "./Expr";
import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";
import { BlockStmt, BuildBlockStmt, BuildExprStmt, BuildForStmt, BuildFunStmt, BuildIfStmt, BuildVarStmt, Stmt } from "./Stmt";
import { Identifier, Match, TokenLike } from "./utils";

export type ParseStmtError<M extends string> = ErrorResult<`[ParseStmtError]: ${M}`>;
export type ParseStmtSuccess<R extends Stmt, T extends Token[]> = SuccessResult<{ stmt: R, rest: T }>;


export type ParseDecl<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'var'>, infer Rest>
        ? ParseVarStmt<Rest>
        : Tokens extends Match<TokenLike<'fun'>, infer Rest>
            ? ParseFunStmt<Rest>
            : ParseStmt<Tokens>;

type ParseStmt<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'{'>, infer Rest>
        ? ParseBlockStmt<Rest>
        : Tokens extends Match<TokenLike<'if'>, infer Rest>
            ? ParseIfStmt<Rest>
            : Tokens extends Match<TokenLike<'for'>, infer Rest>
                ? ParseForStmt<Rest>
                : ParseExprStmt<Tokens>;

type ParseForStmt<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? Rest extends Match<TokenLike<';'>, infer Rest>
        ? ParseForStmtFromCondition<Rest, null>
        : Rest extends Match<TokenLike<'var'>, infer Rest>
            ? ParseForStmtFromInitializerResult<ParseVarStmt<Rest>>
            : ParseForStmtFromInitializerResult<ParseExprStmt<Rest>>
    : ParseStmtError<'Expect "(" after for keyword.'>;

type ParseForStmtFromInitializerResult<IR> =
    IR extends ParseStmtSuccess<infer Initializer, infer Rest>
        ? ParseForStmtFromCondition<Rest, Initializer>
        : IR; // error

type ParseForStmtFromCondition<
    Tokens extends Token[],
    Initializer extends Stmt | null,
> = Tokens extends Match<TokenLike<';'>, infer Rest>
    ? ParseForStmtFromIncrement<Rest, Initializer, null>
    : ParseExpr<Tokens> extends infer CR
        ? CR extends ParseExprSuccess<infer Condition, infer Rest>
            ? Rest extends Match<TokenLike<';'>, infer Rest>
                ? ParseForStmtFromIncrement<Rest, Initializer, Condition>
                : ParseStmtError<'Expect ";" after for condition.'>
            : CR // error
        : NoWay<'ParseForStmtFromCondition'>

type ParseForStmtFromIncrement<
    Tokens extends Token[],
    Initializer extends Stmt | null,
    Condition extends Expr | null,
> = Tokens extends Match<TokenLike<')'>, infer Rest>
    ? ParseForStmtFromBody<Rest, Initializer, Condition, null>
    : ParseExpr<Tokens> extends infer IR
        ? IR extends ParseExprSuccess<infer Increment, infer Rest>
            ? Rest extends Match<TokenLike<')'>, infer Rest>
                ? ParseForStmtFromBody<Rest, Initializer, Condition, Increment>
                : ParseStmtError<'Expect ")" after for increment.'>
            : IR // error
        : NoWay<'ParseForStmtFromIncrement'>;

type ParseForStmtFromBody<
    Tokens extends Token[],
    Initializer extends Stmt | null,
    Condition extends Expr | null,
    Increment extends Expr | null,
    BR = ParseStmt<Tokens>,
> = BR extends ParseStmtSuccess<infer Body, infer Rest>
    ? ParseStmtSuccess<BuildForStmt<Initializer, Condition, Increment, Body>, Rest>
    : BR; // error

type ParseFunStmt<
    Tokens extends Token[],
> = Tokens extends Match<infer Name extends Identifier, infer Rest>
    ? ParseFunParams<Rest> extends infer PR
        ? PR extends Match<infer Params extends Identifier[], infer Rest>
            ? Rest extends Match<TokenLike<'{'>, infer Rest>
                ? ParseBlockStmt<Rest> extends infer BR
                    ? BR extends ParseStmtSuccess<infer Body extends BlockStmt, infer Rest>
                        ? ParseStmtSuccess<BuildFunStmt<Name, Params, Body>, Rest>
                        : BR // error
                    : NoWay<'ParseFunStmt-ParseBlockStmt'>
                : PR // error
            : ParseStmtError<`Expect '{' before function body.`>
        : NoWay<'ParseFunStmt-ParseFunParams'>
    : ParseStmtError<`Expect function name, but got: ${Tokens[0]['type']}`>;
type ParseFunParams<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? Rest extends Match<TokenLike<')'>, infer Rest>
        ? [[], ...Rest]
        : ParseFunParamsCore<Rest> extends infer PR
            ? PR extends Match<infer Params extends Identifier[], infer Rest>
                ? Rest extends Match<TokenLike<')'>, infer Rest>
                    ? [Params, ...Rest]
                    : ParseStmtError<`Expect ')', but got: ${Rest[0]['type']}`>
                : PR // error
            : NoWay<'ParseFunParams-ParseFunParamsCore'>
    : ParseStmtError<`Expect '(', but got: ${Tokens[0]['type']}`>;
type ParseFunParamsCore<
    Tokens extends Token[],
    Params extends Identifier[] = [],
> = Tokens extends Match<infer P extends Identifier, infer Rest>
    ? Rest extends Match<TokenLike<','>, infer Rest>
        ? ParseFunParamsCore<Rest, Push<Params, P>>
        : [Push<Params, P>, ...Rest]
    : ParseStmtError<`Expect param name, but got: ${Tokens[0]['type']}`>;

type ParseIfStmt<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? ParseExpr<Rest> extends infer ER
        ? ER extends ParseExprSuccess<infer Condition, infer Rest>
            ? Rest extends Match<TokenLike<')'>, infer Rest>
                ? ParseStmt<Rest> extends infer IfSR
                    ? IfSR extends ParseStmtSuccess<infer IfClause, infer Rest>
                        ? Rest extends Match<TokenLike<'else'>, infer Rest>
                            ? ParseStmt<Rest> extends infer ElseSR
                                ? ElseSR extends ParseStmtSuccess<infer ElseClause, infer Rest>
                                    ? ParseStmtSuccess<BuildIfStmt<Condition, IfClause, ElseClause>, Rest>
                                    : ElseSR // error
                                : NoWay<'ParseIfStmt-ParseStmt-else'>
                            : ParseStmtSuccess<BuildIfStmt<Condition, IfClause, null>, Rest>
                        : IfSR // error
                    : NoWay<'ParseIfStmt-ParseStmt-if'>
                : ParseStmtError<'Expect ")" after if condition.'>
            : ER // error
        : NoWay<'ParseIfStmt-ParseExpr'>
    : ParseStmtError<'Expect "(" before if condition.'>;

type ParseBlockStmt<
    Tokens extends Token[],
    Stmts extends Stmt[] = [],
> = Tokens extends [EOF]
    ? ParseStmtError<'Expect "}" close block statement.'>
    : Tokens extends Match<TokenLike<'}'>, infer Rest>
        ? ParseStmtSuccess<BuildBlockStmt<Stmts>, Rest>
        : ParseBlockStmtBody<ParseDecl<Tokens>, Stmts>;
type ParseBlockStmtBody<SR, Stmts extends Stmt[]> =
    SR extends ParseStmtSuccess<infer S, infer R>
        ? ParseBlockStmt<R, Push<Stmts, S>>
        : SR; // error
type t = ParseBlockStmt<[BuildToken<'{', '{'>, BuildToken<'}', '}'>, EOF]>

type ParseVarStmt<Tokens extends Token[]> =
    Tokens extends Match<infer VarName extends Identifier, infer Rest>
        ? Rest extends Match<TokenLike<';'>, infer Rest>
            ? ParseStmtSuccess<BuildVarStmt<VarName, null>, Rest>
            : Rest extends Match<TokenLike<'='>, infer Rest>
                ? ParseExpr<Rest> extends ParseExprSuccess<infer Exp, infer Rest>
                    ? Rest extends Match<TokenLike<';'>, infer Rest>
                        ? ParseStmtSuccess<BuildVarStmt<VarName, Exp>, Rest>
                        : ParseStmtError<'Expect ";" after var initializer expression.'>
                    : ParseStmtError<'Parse var initializer expression failed.'>
                : ParseStmtError<'Expect ";" or "=" after var name.'>
        : ParseStmtError<'Expect var name.'>;
// type tParseVarStmt = ParseVarStmt<[
//     BuildToken<"identifier", "b">,
//     BuildToken<"=", "=">,
//     BuildToken<"number", "6">,
//     BuildToken<";", ";">,
//     EOF]>;

type ParseExprStmt<Tokens extends Token[], R = ParseExpr<Tokens>> =
    R extends ParseExprSuccess<infer Expr, infer Rest>
        ? Rest extends Match<TokenLike<';'>, infer Rest>
            ? ParseStmtSuccess<BuildExprStmt<Expr>, Rest>
            : ParseStmtError<'Expect ";" after expression.'>
        : R; // error

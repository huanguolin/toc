import { ErrorResult, NoWay, SuccessResult } from "../Result";
import { EOF, Token } from "../scanner/Token";
import { Push } from "../utils/array";
import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";
import { BuildBlockStmt, BuildExprStmt, BuildIfStmt, BuildVarStmt, Stmt } from "./Stmt";
import { Match, TokenLike } from "./utils";

export type ParseStmtError<M extends string> = ErrorResult<`[ParseStmtError]: ${M}`>;
export type ParseStmtSuccess<R extends Stmt, T extends Token[]> = SuccessResult<{ stmt: R, rest: T }>;

export type ParseStmt<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'var'>, infer Rest>
        ? ParseVarStmt<Rest>
        : Tokens extends Match<TokenLike<'{'>, infer Rest>
            ? ParseBlockStmt<Rest>
            : Tokens extends Match<TokenLike<'if'>, infer Rest>
                ? ParseIfStmt<Rest>
                : ParseExprStmt<Tokens>;

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
    ? ParseStmtError<'Expect "}" end the block.'>
    : Tokens extends Match<TokenLike<'}'>, infer Rest>
        ? ParseStmtSuccess<BuildBlockStmt<Stmts>, Rest>
        : ParseBlockStmtBody<ParseStmt<Tokens>, Stmts>;
type ParseBlockStmtBody<SR, Stmts extends Stmt[]> =
    SR extends ParseStmtSuccess<infer S, infer R>
        ? ParseBlockStmt<R, Push<Stmts, S>>
        : SR; // error

type ParseVarStmt<Tokens extends Token[]> =
    Tokens extends Match<infer VarName extends TokenLike<{ type: 'identifier' }>, infer Rest>
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
    ParseExpr<Tokens> extends ParseExprSuccess<infer Expr, infer Rest1>
        ? Rest1 extends Match<TokenLike<';'>, infer Rest2>
            ? ParseStmtSuccess<BuildExprStmt<Expr>, Rest2>
            : ParseStmtError<'Expect ";" after expression.'>
        : R; // error

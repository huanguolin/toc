import { ErrorResult, SuccessResult } from "../Result";
import { BuildToken, EOF, Token, TokenLike } from "../scanner/Token";
import { Push } from "../utils/array";
import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";
import { BuildBlockStmt, BuildExprStmt, BuildVarStmt, ExprStmt, Stmt } from "./Stmt";

export type ParseStmtError<M extends string> = ErrorResult<`[ParseStmtError]: ${M}`>;
export type ParseStmtSuccess<R extends Stmt, T extends Token[]> = SuccessResult<{ stmt: R, rest: T }>;

type VarKeyWord = TokenLike<{ type: 'var' }>;
export type ParseStmt<Tokens extends Token[]> =
    Tokens extends [infer Var extends VarKeyWord, ...infer Rest extends Token[]]
        ? ParseVarStmt<Rest>
        : Tokens extends [BuildToken<'{', '{'>, ...infer Rest extends Token[]]
            ? ParseBlockStmt<Rest>
            : ParseExprStmt<Tokens>;

type ParseBlockStmt<
    Tokens extends Token[],
    Stmts extends Stmt[] = [],
> = Tokens extends [EOF]
    ? ParseStmtError<'Expect "}" end the block.'>
    : Tokens extends [infer End extends TokenLike<{ type: '}'}>, ...infer Rest extends Token[]]
        ? ParseStmtSuccess<BuildBlockStmt<Stmts>, Rest>
        : ParseBlockStmtBody<ParseStmt<Tokens>, Stmts>;
type ParseBlockStmtBody<SR, Stmts extends Stmt[]> =
    SR extends ParseStmtSuccess<infer S, infer R>
        ? ParseBlockStmt<R, Push<Stmts, S>>
        : SR; // error

type ParseVarStmt<Tokens extends Token[]> =
    Tokens extends [infer VarName extends TokenLike<{ type: 'identifier' }>, ...infer Rest extends Token[]]
        ? Rest extends [infer Semi extends TokenLike<{ type: ';' }>, ...infer Rest extends Token[]]
            ? ParseStmtSuccess<BuildVarStmt<VarName, null>, Rest>
            : Rest extends [infer Op extends TokenLike<{ type: '=' }>, ...infer Rest extends Token[]]
                ? ParseExpr<Rest> extends ParseExprSuccess<infer Exp, infer Rest>
                    ? Rest extends [infer Semi extends TokenLike<{ type: ';' }>, ...infer Rest extends Token[]]
                        ? ParseStmtSuccess<BuildVarStmt<VarName, Exp>, Rest>
                        : ParseStmtError<'Expect ";" after var initializer expression.'>
                    : ParseStmtError<'Parse var initializer expression failed.'>
                : ParseStmtError<'Expect ";" or "=" after var name.'>
        : ParseStmtError<'Expect var name.'>;
type tParseVarStmt = ParseVarStmt<[
    BuildToken<"identifier", "b">,
    BuildToken<"=", "=">,
    BuildToken<"number", "6">,
    BuildToken<";", ";">,
    EOF]>;

type ParseExprStmt<Tokens extends Token[], R = ParseExpr<Tokens>> =
    ParseExpr<Tokens> extends ParseExprSuccess<infer Expr, infer Rest1>
        ? Rest1 extends [infer Semi extends TokenLike<{ type: ';' }>, ...infer Rest2 extends Token[]]
            ? ParseStmtSuccess<BuildExprStmt<Expr>, Rest2>
            : ParseStmtError<'Expect ";" after expression.'>
        : R; // error

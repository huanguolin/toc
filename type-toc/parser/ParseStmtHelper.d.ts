import { ErrorResult, SuccessResult } from "../Result";
import { BuildToken, EOF, Token, TokenLike } from "../scanner/Token";
import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";
import { BuildExprStmt, BuildVarStmt, ExprStmt, Stmt } from "./Stmt";

export type ParseStmtError<M extends string> = ErrorResult<`[ParseStmtError]: ${M}`>;
export type ParseStmtSuccess<R extends Stmt, T extends Token[]> = SuccessResult<{ stmt: R, rest: T }>;

type VarKeyWord = TokenLike<{ type: 'var' }>;
export type ParseStmt<Tokens extends Token[]> =
    Tokens extends [infer Var extends VarKeyWord, ...infer Rest extends Token[]]
        ? ParseVarStmt<Rest>
        : ParseExprStmt<Tokens>;

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

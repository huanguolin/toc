import { ErrorResult, SuccessResult } from "../Result";
import { Token } from "../scanner/Token";
import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";
import { BuildExprStmt, Stmt } from "./Stmt";

export type ParseStmtError<M extends string> = ErrorResult<`[ParseStmtError]: ${M}`>;
export type ParseStmtSuccess<R extends Stmt, T extends Token[]> = SuccessResult<{ stmt: R, rest: T }>;

export type ParseStmt<Tokens extends Token[]> = ParseExprStmt<Tokens>;

type SemicolonToken = { type: ';' };

type ParseExprStmt<Tokens extends Token[], R = ParseExpr<Tokens>> =
    ParseExpr<Tokens> extends ParseExprSuccess<infer Expr, infer Rest1>
        ? Rest1 extends [infer Semi extends SemicolonToken, ...infer Rest2 extends Token[]]
            ? ParseStmtSuccess<BuildExprStmt<Expr>, Rest2>
            : ParseStmtError<'Expect ";" after expression.'>
        : R; // error

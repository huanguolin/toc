import { ExprStmt, Stmt } from "../parser/Stmt";
import { ErrorResult, SuccessResult } from "../Result"
import { InterpretExpr } from "./InterpretExpr";
import { RuntimeError } from "./RuntimeError";

export type InterpretStmtError<M extends string> = ErrorResult<`[InterpretStmtError]: ${M}`>;
export type InterpretStmtSuccess<R> = SuccessResult<R>;

export type InterpretStmt<S extends Stmt> =
    S extends ExprStmt
        ? InterpretExprStmt<S>
        : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretExprStmt<S extends ExprStmt, R = InterpretExpr<S['expression']>> = 
    R extends RuntimeError<string>
        ? R // error
        : InterpretStmtSuccess<R>;

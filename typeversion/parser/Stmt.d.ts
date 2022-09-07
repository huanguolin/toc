import { Expr } from "./Expr";


export type StmtType =
    | 'expression';

export interface Stmt {
    type: StmtType;
}

export interface ExprStmt extends Stmt {
    type: 'expression';
    expression: Expr;
}

export type BuildExprStmt<E extends Expr> = { type: 'expression', expression: E };


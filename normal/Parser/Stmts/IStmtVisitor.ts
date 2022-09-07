import { ExprStmt } from "./ExprStmt";

export interface IStmtVisitor<T> {
    visitExprStmt: (expr: ExprStmt) => T;
}
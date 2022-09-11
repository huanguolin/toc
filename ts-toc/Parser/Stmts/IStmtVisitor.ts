import { ExprStmt } from "./ExprStmt";
import { VarStmt } from "./varStmt";

export interface IStmtVisitor<T> {
    visitExprStmt: (stmt: ExprStmt) => T;
    visitVarStmt: (stmt: VarStmt) => T;
}
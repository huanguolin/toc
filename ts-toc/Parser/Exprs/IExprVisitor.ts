import { AssignExpr } from "./AssignExpr";
import { BinaryExpr } from "./BinaryExpr";
import { CallExpr } from "./CallExpr";
import { GroupExpr } from "./GroupExpr";
import { LiteralExpr } from "./LiteralExpr";
import { UnaryExpr } from "./UnaryExpr";
import { VariableExpr } from "./VariableExpr";

export interface IExprVisitor<T> {
    visitAssignExpr: (expr: AssignExpr) => T;
    visitBinaryExpr: (expr: BinaryExpr) => T;
    visitGroupExpr: (expr: GroupExpr) => T;
    visitUnaryExpr: (expr: UnaryExpr) => T;
    visitLiteralExpr: (expr: LiteralExpr) => T;
    visitVariableExpr: (expr: VariableExpr) => T;
    visitCallExpr: (expr: CallExpr) => T;
}
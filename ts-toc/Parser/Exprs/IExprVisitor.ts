import { BinaryExpr } from "./BinaryExpr";
import { GroupExpr } from "./GroupExpr";
import { LiteralExpr } from "./LiteralExpr";
import { UnaryExpr } from "./UnaryExpr";

export interface IExprVisitor<T> {
    visitBinaryExpr: (expr: BinaryExpr) => T;
    visitGroupExpr: (expr: GroupExpr) => T;
    visitUnaryExpr: (expr: UnaryExpr) => T;
    visitLiteralExpr: (expr: LiteralExpr) => T;
}
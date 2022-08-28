import { BinaryExpr } from "./BinaryExpr";
import { GroupExpr } from "./GroupExpr";
import { LiteralExpr } from "./LiteralExpr";

export interface IVisitor {
    visitBinaryExpr: (expr: BinaryExpr) => number;
    visitGroupExpr: (expr: GroupExpr) => number;
    visitLiteralExpr: (expr: LiteralExpr) => number;
}
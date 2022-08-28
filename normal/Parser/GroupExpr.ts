import { ExprType, IExpr } from "./IExpr";
import { IVisitor } from "./IVisitor";

export class GroupExpr implements IExpr {
    type: ExprType = 'group';
    expression: IExpr;

    constructor(expr: IExpr) {
        this.expression = expr;
    }

    accept(visitor: IVisitor): number {
        return visitor.visitGroupExpr(this);
    }
}
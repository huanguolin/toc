import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class GroupExpr implements IExpr {
    type: ExprType = 'group';
    expression: IExpr;

    constructor(expr: IExpr) {
        this.expression = expr;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitGroupExpr(this);
    }
}
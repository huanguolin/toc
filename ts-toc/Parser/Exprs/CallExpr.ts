import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class CallExpr implements IExpr {
    type: ExprType = 'call';
    callee: IExpr;
    args: IExpr[];

    constructor(callee: IExpr, args: IExpr[]) {
        this.callee = callee;
        this.args = args;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }
}
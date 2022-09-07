import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: number | boolean;

    constructor(value: number | boolean) {
        this.value = value;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}
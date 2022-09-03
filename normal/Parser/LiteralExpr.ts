import { ExprType, IExpr } from "./IExpr";
import { IVisitor } from "./IVisitor";

export class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: number | boolean;

    constructor(value: number | boolean) {
        this.value = value;
    }

    accept<R>(visitor: IVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}
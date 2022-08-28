import { ExprType, IExpr } from "./IExpr";
import { IVisitor } from "./IVisitor";

export class LiteralExpr implements IExpr {
    type: ExprType;
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    accept(visitor: IVisitor): number {
        return visitor.visitLiteralExpr(this);
    }
}
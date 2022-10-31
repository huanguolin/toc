import { ValueType } from "../../type";
import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: ValueType;

    constructor(value: ValueType) {
        this.value = value;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}
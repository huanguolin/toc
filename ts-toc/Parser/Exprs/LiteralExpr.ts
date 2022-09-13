import { FunObject } from "../../FunObject";
import { ValueType } from "../../type";
import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: Exclude<ValueType, FunObject>;

    constructor(value: Exclude<ValueType, FunObject>) {
        this.value = value;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}
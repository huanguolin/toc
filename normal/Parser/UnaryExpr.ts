import { Token } from "../Scanner/Token";
import { ExprType, IExpr } from "./IExpr";
import { IVisitor } from "./IVisitor";

export class UnaryExpr implements IExpr {
    type: ExprType = 'unary';
    operator: Token;
    expression: IExpr;

    constructor(operator: Token, expr: IExpr) {
        this.operator = operator;
        this.expression = expr;
    }

    accept<R>(visitor: IVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}
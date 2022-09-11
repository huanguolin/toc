import { Token } from "../../Scanner/Token";
import { ExprType, IExpr } from "./IExpr";
import { IExprVisitor } from "./IExprVisitor";

export class VariableExpr implements IExpr {
    type: ExprType = 'variable';
    name: Token;

    constructor(name: Token) {
        this.name = name;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}
import { Token } from "../Scanner/Token";
import { ExprType, IExpr } from "./IExpr";
import { IVisitor } from "./IVisitor";

export class BinaryExpr implements IExpr {
    type: ExprType = 'binary';
    left: IExpr;
    operator: Token;
    right: IExpr;

    constructor(left: IExpr, operator: Token, right: IExpr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept(visitor: IVisitor): number {
        return visitor.visitBinaryExpr(this);
    }
}
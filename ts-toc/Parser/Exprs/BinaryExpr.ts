import { Token } from '../../Scanner/Token';

import { ExprType, IExpr } from './IExpr';
import { IExprVisitor } from './IExprVisitor';

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

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}

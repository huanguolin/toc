import { Token } from '../../Scanner/Token';

import { ExprType, IExpr } from './IExpr';
import { IExprVisitor } from './IExprVisitor';

export class AssignExpr implements IExpr {
    type: ExprType = 'assign';
    varName: Token;
    right: IExpr;

    constructor(varName: Token, right: IExpr) {
        this.varName = varName;
        this.right = right;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }
}

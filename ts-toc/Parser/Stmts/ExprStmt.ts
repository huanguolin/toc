import { IExpr } from '../Exprs/IExpr';
import { IStmt } from './IStmt';
import { IStmtVisitor } from './IStmtVisitor';

export class ExprStmt implements IStmt {
    type: 'expression' = 'expression';
    expression: IExpr;

    constructor(expr: IExpr) {
        this.expression = expr;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitExprStmt(this);
    }
}
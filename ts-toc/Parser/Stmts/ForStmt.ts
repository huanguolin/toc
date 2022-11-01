import { IExpr } from '../Exprs/IExpr';

import { IStmt } from './IStmt';
import { IStmtVisitor } from './IStmtVisitor';

export class ForStmt implements IStmt {
    type: 'for' = 'for';
    initializer: IStmt | null;
    condition: IExpr | null;
    increment: IExpr | null;
    body: IStmt;

    constructor(
        initializer: IStmt | null,
        condition: IExpr | null,
        increment: IExpr | null,
        body: IStmt,
    ) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}

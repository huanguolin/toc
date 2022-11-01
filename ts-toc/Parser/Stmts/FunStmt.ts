import { Token } from '../../Scanner/Token';

import { BlockStmt } from './BlockStmt';
import { IStmt } from './IStmt';
import { IStmtVisitor } from './IStmtVisitor';

export class FunStmt implements IStmt {
    type: 'fun' = 'fun';
    name: Token;
    parameters: Token[];
    body: BlockStmt;

    constructor(name: Token, parameters: Token[], body: BlockStmt) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitFunStmt(this);
    }
}

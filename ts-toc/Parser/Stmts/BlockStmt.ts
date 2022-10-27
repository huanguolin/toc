import { IStmt } from "./IStmt";
import { IStmtVisitor } from "./IStmtVisitor";

export class BlockStmt implements IStmt {
    type: 'block' = 'block';
    stmts: IStmt[];

    constructor(stmts: IStmt[]) {
        this.stmts = stmts;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitBlockStmt(this);
    }
}
import { IExpr } from "../Exprs/IExpr";
import { IStmt } from "./IStmt";
import { IStmtVisitor } from "./IStmtVisitor";

export class IfStmt implements IStmt {
    type: 'if' = 'if';
    condition: IExpr;
    ifClause: IStmt;
    elseClause: IStmt | null;

    constructor(
        cond: IExpr,
        ifClause: IStmt,
        elseClause: IStmt | null = null) {
        this.condition = cond;
        this.ifClause = ifClause;
        this.elseClause = elseClause;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
}
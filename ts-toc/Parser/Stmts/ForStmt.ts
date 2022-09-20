import { Token } from "../../Scanner/Token";
import { IExpr } from "../Exprs/IExpr";
import { BlockStmt } from "./BlockStmt";
import { IStmt } from "./IStmt";
import { IStmtVisitor } from "./IStmtVisitor";

export class ForStmt implements IStmt {
    type: 'for';
    initializer: IStmt | null;
    condition: IExpr | null;
    increment: IExpr | null;
    body: IStmt;

    constructor(
        initializer: IStmt | null,
        condition: IExpr | null,
        increment: IExpr | null,
        body: IStmt) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}
import { Token } from "../../Scanner/Token";
import { IExpr } from "../Exprs/IExpr";
import { IStmt } from "./IStmt";
import { IStmtVisitor } from "./IStmtVisitor";

export class VarStmt implements IStmt {
    type: 'varDeclaration';
    name: Token;
    initializer: IExpr | null;

    constructor(token: Token, initializer: IExpr | null) {
        this.name = token;
        this.initializer = initializer;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}
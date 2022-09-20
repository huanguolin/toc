import { IStmtVisitor } from "./IStmtVisitor";

export type StmtType =
    | 'expression'
    | 'varDeclaration'
    | 'block'
    | 'if'
    | 'fun'
    | 'for';

export interface IStmt {
    type: StmtType;
    accept: <R>(visitor: IStmtVisitor<R>) => R;
}
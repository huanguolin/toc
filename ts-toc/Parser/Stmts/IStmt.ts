import { IStmtVisitor } from "./IStmtVisitor";

export type StmtType =
    | 'expression'
    | 'varDeclaration';

export interface IStmt {
    type: StmtType;
    accept: <R>(visitor: IStmtVisitor<R>) => R;
}
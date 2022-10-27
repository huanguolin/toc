import { IStmtVisitor } from "./IStmtVisitor";

export type StmtType =
    | 'expression'
    | 'var'
    | 'block'
    | 'if'
    | 'fun'
    | 'for';

export interface IStmt {
    type: StmtType;
    accept: <R>(visitor: IStmtVisitor<R>) => R;
}
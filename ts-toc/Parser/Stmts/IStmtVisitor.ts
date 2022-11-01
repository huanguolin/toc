import { BlockStmt } from './BlockStmt';
import { ExprStmt } from './ExprStmt';
import { ForStmt } from './ForStmt';
import { FunStmt } from './FunStmt';
import { IfStmt } from './IfStmt';
import { VarStmt } from './varStmt';

export interface IStmtVisitor<T> {
    visitExprStmt: (stmt: ExprStmt) => T;
    visitVarStmt: (stmt: VarStmt) => T;
    visitBlockStmt: (stmt: BlockStmt) => T;
    visitIfStmt: (stmt: IfStmt) => T;
    visitFunStmt: (stmt: FunStmt) => T;
    visitForStmt: (stmt: ForStmt) => T;
}

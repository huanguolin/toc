import { Token } from "../scanner/Token";
import { Expr } from "./Expr";


export type StmtType =
    | 'expression'
    | 'varDeclaration'
    | 'block';

export interface Stmt {
    type: StmtType;
}

export interface ExprStmt extends Stmt {
    type: 'expression';
    expression: Expr;
}

export interface VarStmt extends Stmt {
    type: 'varDeclaration';
    name: Token;
    initializer: Expr | null;
}

export interface BlockStmt extends Stmt {
    type: 'block';
    stmts: Stmt[];
}

export type BuildExprStmt<E extends Expr> = { type: 'expression', expression: E };
export type BuildVarStmt<N extends Token, E extends Expr | null> = { type: 'varDeclaration', name: N, initializer: E };
export type BuildBlockStmt<Stmts extends Stmt[]> = { type: 'block', stmts: Stmts };


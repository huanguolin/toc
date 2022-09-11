import { Token } from "../scanner/Token";
import { Expr } from "./Expr";


export type StmtType =
    | 'expression'
    | 'varDeclaration';

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

export type BuildExprStmt<E extends Expr> = { type: 'expression', expression: E };
export type BuildVarStmt<N extends Token, E extends Expr | null> = { type: 'varDeclaration', name: N, initializer: E };


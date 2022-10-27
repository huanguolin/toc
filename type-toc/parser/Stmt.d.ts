import { Token } from "../scanner/Token";

import { Expr } from "./Expr";
import { Identifier } from "./utils";


export type StmtType =
    | 'expression'
    | 'var'
    | 'block'
    | 'if'
    | 'for'
    | 'fun';

export interface Stmt {
    type: StmtType;
}

export interface ExprStmt extends Stmt {
    type: 'expression';
    expression: Expr;
}

export interface BuildExprStmt<E extends Expr> extends ExprStmt {
    expression: E;
}

export interface VarStmt extends Stmt {
    type: 'var';
    name: Identifier;
    initializer: Expr | null;
}

export interface BuildVarStmt<N extends Identifier, E extends Expr | null> extends VarStmt {
    name: N;
    initializer: E;
}

export interface BlockStmt extends Stmt {
    type: 'block';
    stmts: Stmt[];
}

export interface BuildBlockStmt<Stmts extends Stmt[]> extends BlockStmt {
    stmts: Stmts;
}

export interface IfStmt extends Stmt {
    type: 'if';
    condition: Expr;
    ifClause: Stmt;
    elseClause: Stmt | null;
}

export interface BuildIfStmt<
    Condition extends Expr,
    IfClause extends Stmt,
    ElseClause extends Stmt | null = null
> extends IfStmt {
    condition: Condition;
    ifClause: IfClause;
    elseClause: ElseClause;
}

export interface FunStmt extends Stmt {
    type: 'fun';
    name: Token;
    parameters: Token[];
    body: BlockStmt;
}

export interface BuildFunStmt<
    Name extends Identifier,
    Parameters extends Identifier[],
    Body extends BlockStmt,
> extends FunStmt {
    name: Name;
    parameters: Parameters;
    body: Body;
}

export interface ForStmt extends Stmt {
    type: 'for';
    initializer: Stmt | null;
    condition: Expr | null;
    increment: Expr | null;
    body: Stmt;
}

export interface BuildForStmt<
    Initializer extends Stmt | null,
    Condition extends Expr | null,
    Increment extends Expr | null,
    Body extends Stmt,
> extends ForStmt {
    initializer: Initializer;
    condition: Condition;
    increment: Increment;
    body: Body;
}

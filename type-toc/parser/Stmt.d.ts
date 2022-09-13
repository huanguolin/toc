import { Token } from "../scanner/Token";
import { Expr } from "./Expr";


export type StmtType =
    | 'expression'
    | 'varDeclaration'
    | 'block'
    | 'if'
    | 'fun';

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

export interface IfStmt extends Stmt {
    type: 'if';
    condition: Expr;
    ifClause: Stmt;
    elseClause: Stmt | null;
}

export interface FunStmt extends Stmt {
    type: 'fun';
    name: Token;
    parameters: Token[];
    body: BlockStmt;
}

export type BuildExprStmt<E extends Expr> = { type: 'expression', expression: E };
export type BuildVarStmt<N extends Token, E extends Expr | null> = { type: 'varDeclaration', name: N, initializer: E };
export type BuildBlockStmt<Stmts extends Stmt[]> = { type: 'block', stmts: Stmts };
export type BuildIfStmt<
    Condition extends Expr,
    IfClause extends Stmt,
    ElseClause extends Stmt | null = null
> = {
    type: 'if',
    condition: Condition,
    ifClause: IfClause,
    elseClause: ElseClause,
};
export type BuildFunStmt<
    Name extends Token,
    Parameters extends Token[],
    Body extends BlockStmt,
> = {
    type: 'fun',
    name: Name,
    parameters: Parameters,
    body: Body,
};


import { Token } from "../scanner/Token";

export type ExprType =
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal';

export interface Expr {
    type: ExprType;
}

export interface LiteralExpr extends Expr {
    type: 'literal';
    value: number | boolean;
}

export interface GroupExpr extends Expr {
    type: 'group';
    expression: Expr;
}

export interface BinaryExpr extends Expr {
    type: 'binary';
    left: Expr;
    operator: Token;
    right: Expr;
}

export interface UnaryExpr extends Expr {
    type: 'unary';
    operator: Token;
    expression: Expr;
}

export type BuildLiteralExpr<V extends number | boolean> = { type: 'literal', value: V };
export type BuildGroupExpr<E extends Expr> = { type: 'group', expression: E };
export type BuildBinaryExpr<L extends Expr, Op extends Token, R extends Expr> = { type: 'binary', left: L, operator: Op, right: R };
export type BuildUnaryExpr<Op extends Token, E extends Expr> = { type: 'unary', operator: Op, expression: E };


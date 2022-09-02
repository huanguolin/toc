import { Token } from "../scanner/Token";

export type ExprType = 'group' | 'binary' | 'literal';

export interface Expr {
    type: ExprType;
}

export interface LiteralExpr extends Expr {
    type: 'literal';
    value: number;
}

export interface GroupExpr extends Expr {
    type: 'group';
    expr: Expr;
}

export interface BinaryExpr extends Expr {
    type: 'binary';
    left: Expr;
    operator: Token;
    right: Expr;
}

export type BuildLiteral<V extends number> = { type: 'literal', value: V };
export type BuildGroup<E extends Expr> = { type: 'group', expr: E };
export type BuildBinary<L extends Expr, Op extends Token, R extends Expr> = { type: 'binary', left: L, operator: Op, right: R };


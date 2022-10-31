import { Token } from "../scanner/Token";
import { ValueType } from "../type";

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
    value: ValueType;
}

export interface BuildLiteralExpr<T extends ValueType> extends LiteralExpr {
    value: T
}

export interface GroupExpr extends Expr {
    type: 'group';
    expression: Expr;
}

export interface BuildGroupExpr<E extends Expr> extends GroupExpr {
    expression: E;
}

export interface BinaryExpr extends Expr {
    type: 'binary';
    left: Expr;
    operator: Token;
    right: Expr;
}

export interface BuildBinaryExpr<L extends Expr, Op extends Token, R extends Expr> extends BinaryExpr {
    left: L;
    operator: Op;
    right: R;
}

export interface UnaryExpr extends Expr {
    type: 'unary';
    operator: Token;
    expression: Expr;
}

export interface BuildUnaryExpr<Op extends Token, E extends Expr> extends UnaryExpr {
    operator: Op;
    expression: E;
}
import { FunObject } from "../FunObject";
import { Token } from "../scanner/Token";
import { ValueType } from "../type";

import { Identifier } from "./utils";

export type ExprType =
    | 'assign'
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal'
    | 'variable'
    | 'call';

export interface Expr {
    type: ExprType;
}

export interface LiteralExpr extends Expr {
    type: 'literal';
    value: Exclude<ValueType, FunObject>;
}

export interface BuildLiteralExpr<T extends Exclude<ValueType, FunObject>> extends LiteralExpr {
    value: T
}

export interface VariableExpr extends Expr {
    type: 'variable';
    name: Identifier;
}

export interface BuildVariableExpr<T extends Identifier> extends VariableExpr {
    name: T;
}

export interface AssignExpr extends Expr {
    type: 'assign';
    varName: Token;
    right: Expr;
}

export interface BuildAssignExpr<N extends Identifier, E extends Expr> extends AssignExpr {
    varName: N;
    right: E;
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

export interface CallExpr extends Expr {
    type: 'call';
    callee: Expr;
    arguments: Expr[];
}

export interface BuildCallExpr<Callee extends Expr, Args extends Expr[]> extends CallExpr {
    callee: Callee;
    arguments: Args;
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
import { SuccessResult } from "../Result";
import { BinaryExpr, Expr, GroupExpr, LiteralExpr, UnaryExpr } from "../parser/Expr";
import { TokenType, ValueType } from "../type";
import { Eq, Safe } from "../utils/common";
import { Inverse, IsTrue } from "../utils/logic";
import { Add, Div, Gt, Gte, Lt, Lte, Mod, Mul, Sub } from "../utils/math/fast/index";

import { RuntimeError } from './RuntimeError';

export type InterpretExprSuccess<Value extends ValueType> = SuccessResult<{ value: Value }>;


export type InterpretExpr<E extends Expr> =
    E extends LiteralExpr
        ? InterpretExprSuccess<E['value']>
        : E extends GroupExpr
            ? InterpretExpr<E['expression']>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E>
                    : RuntimeError<`Unknown expression type: ${E['type']}`>;

type EvalUnaryExpr<
    E extends UnaryExpr,
    Op extends TokenType = E['operator']['type'],
    V = InterpretExpr<E['expression']>
> = Op extends '!'
    ? V extends InterpretExprSuccess<infer Val>
        ? InterpretExprSuccess<Inverse<Val>>
        : V // error
    : RuntimeError<`Unknown unary operator: ${Op}`>;


type EvalBinaryExpr<
    E extends BinaryExpr,
    Op extends TokenType = E['operator']['type'],
    LR = InterpretExpr<E['left']>,
    Right extends Expr = E['right'], // 不能直接求值 Right, 因为 && || 有短路的效果。
> =
    LR extends InterpretExprSuccess<infer LV>
        ? Op extends '==' | '!='
            ? EvalEquality<Op, LV, InterpretExpr<Right>>
            : Op extends '&&' | '||'
                ? EvalLogicAndOr<Op, LV, Right>
                : EvalRestBinaryExpr<Op, LV, InterpretExpr<Right>>
        : LR; // error

type EvalLogicAndOr<
    Op extends '&&' | '||',
    LV extends ValueType,
    Right extends Expr,
> = Op extends '&&'
    ? IsTrue<LV> extends true
        ? InterpretExpr<Right>
        : InterpretExprSuccess<LV>
    : Op extends '||'
        ? IsTrue<LV> extends true
            ? InterpretExprSuccess<LV>
            : InterpretExpr<Right>
        : RuntimeError<`EvalLogicAndOr fail when meet: ${Op}`>;

type EvalEquality<
    Op extends '==' | '!=',
    LV extends ValueType,
    RR,
> = RR extends InterpretExprSuccess<infer RV>
    ? Op extends '=='
        ? InterpretExprSuccess<Eq<LV, RV>>
        : Op extends '!='
            ? InterpretExprSuccess<Inverse<Eq<LV, RV>>>
            : RuntimeError<`EvalEquality fail when meet: ${Op}`>
    : RR; // error

type EvalRestBinaryExpr<
    Op extends TokenType,
    LV extends ValueType,
    RR,
> = RR extends InterpretExprSuccess<infer RV>
    ? Op extends '+'
        ? [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? WrapBinaryResult<Add<N1, N2>>
            : [LV, RV] extends IsStrings<infer N1, infer N2>
                ? WrapBinaryResult<`${N1}${N2}`>
                : RuntimeError<'"+" operator only support both operand is string or number.'>
        : [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? EvalMath<Op, N1, N2>
            : RuntimeError<`EvalRestBinaryExpr fail, Left or Right is not a number: left:${ExtractError<LV>}, right:${ExtractError<RR>}`>
    : RR; // error

type IsStrings<N1 extends string, N2 extends string> = [N1, N2];
type IsNumbers<N1 extends number, N2 extends number> = [N1, N2];

type EvalMath<
    Op extends TokenType,
    N1 extends number,
    N2 extends number,
> = Op extends '-'
    ? WrapBinaryResult<Sub<N1, N2>>
    : Op extends '*'
        ? WrapBinaryResult<Mul<N1, N2>>
        : Op extends '/'
            ? WrapBinaryResult<Div<N1, N2>>
            : Op extends '%'
                ? WrapBinaryResult<Mod<N1, N2>>
                : Op extends '<'
                    ? WrapBinaryResult<Lt<N1, N2>>
                    : Op extends '>'
                        ? WrapBinaryResult<Gt<N1, N2>>
                        : Op extends '<='
                            ? WrapBinaryResult<Lte<N1, N2>>
                            : Op extends '>='
                                ? WrapBinaryResult<Gte<N1, N2>>
                                : RuntimeError<`Unknown binary operator: ${Op}`>;

type WrapBinaryResult<V> =
    V extends ValueType
        ? InterpretExprSuccess<V>
        : ExtractError<V>;

type ExtractError<E> =
    E extends { error: infer M extends string }
        ? M
        : Safe<E, string | number | boolean | null | undefined>;

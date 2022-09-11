import { AssignExpr, BinaryExpr, Expr, GroupExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../parser/Expr";
import { SuccessResult } from "../Result";
import { TokenType, ValueType } from "../type";
import { EQ, Safe } from "../utils/common";
import { Inverse, IsTrue } from "../utils/logic";
import { Add, Div, GT, GTE, LT, LTE, Mod, Mul, Sub } from "../utils/math";
import { EnvAssign, EnvGet, Environment } from "./Environment";
import { RuntimeError } from './RuntimeError';

export type InterpretExprSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;


export type InterpretExpr<E extends Expr, Env extends Environment> =
    E extends LiteralExpr
        ? InterpretExprSuccess<E['value'], Env>
        : E extends GroupExpr
            ? InterpretExpr<E['expression'], Env>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E, Env>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E, Env>
                    : E extends VariableExpr
                        ? EvalVariableExpr<E, Env>
                        : E extends AssignExpr
                            ? EvalAssignExpr<E, Env>
                            : RuntimeError<`Unknown expression type: ${E['type']}`>;

type EvalAssignExpr<
    E extends AssignExpr,
    Env extends Environment,
    RV = InterpretExpr<E['right'], Env>
> = RV extends InterpretExprSuccess<infer V, infer Env>
    ? WrapAssignResult<V, EnvAssign<Env, E['varName']['lexeme'], V>>
    : RV; // error
type WrapAssignResult<V extends ValueType, Env> =
    Env extends Environment
        ? InterpretExprSuccess<V, Env>
        : Env; // error

type EvalVariableExpr<
    E extends VariableExpr,
    Env extends Environment,
    V = EnvGet<Env, E['name']['lexeme']>,
> = V extends ValueType
    ? InterpretExprSuccess<V, Env>
    : V; // error

type EvalUnaryExpr<
    E extends UnaryExpr,
    Env extends Environment,
    Op extends TokenType = E['operator']['type'],
    V = InterpretExpr<E['expression'], Env>
> = Op extends '!'
    ? V extends InterpretExprSuccess<infer Val, infer Env>
        ? InterpretExprSuccess<Inverse<Val>, Env>
        : V // error
    : RuntimeError<`Unknown unary operator: ${Op}`>;


type EvalBinaryExpr<
    E extends BinaryExpr,
    Env extends Environment,
    Op extends TokenType = E['operator']['type'],
    LR = InterpretExpr<E['left'], Env>,
    Right extends Expr = E['right'], // 不能直接求值 Right, 因为 && || 有短路的效果。
> =
    LR extends InterpretExprSuccess<infer LV, infer Env>
        ? Op extends '==' | '!='
            ? EvalEquality<Op, LV, InterpretExpr<Right, Env>, Env>
            : Op extends '&&' | '||'
                ? EvalLogicAndOr<Op, LV, Right, Env>
                : EvalMath<Op, LV, InterpretExpr<Right, Env>, Env>
        : LR; // error

type EvalLogicAndOr<
    Op extends '&&' | '||',
    LV extends ValueType,
    Right extends Expr,
    Env extends Environment
> = Op extends '&&'
    ? IsTrue<LV> extends true
        ? InterpretExpr<Right, Env>
        : InterpretExprSuccess<false, Env>
    : Op extends '||'
        ? IsTrue<LV> extends true
            ? InterpretExprSuccess<LV, Env>
            : InterpretExpr<Right, Env>
        : RuntimeError<`EvalLogicAndOr fail when meet: ${Op}`>;


type EvalEquality<
    Op extends '==' | '!=',
    LV extends ValueType,
    RR,
    Env extends Environment, // 不需要，但是为了一致，没去掉
> = RR extends InterpretExprSuccess<infer RV, infer Env>
    ? Op extends '=='
        ? InterpretExprSuccess<EQ<LV, RV>, Env>
        : Op extends '!='
            ? InterpretExprSuccess<Inverse<EQ<LV, RV>>, Env>
            : RuntimeError<`EvalEquality fail when meet: ${Op}`>
    : RR; // error

type IsNumbers<N1 extends number, N2 extends number> = [N1, N2];
// type t = [1, 2] extends IsNumbers<infer A, infer B> ? A : never;
type EvalMath<
    Op extends TokenType,
    LV extends ValueType,
    RR,
    Env extends Environment, // 不需要，但是为了一致，没去掉
> = RR extends InterpretExprSuccess<infer RV, infer Env>
    ? [LV, RV] extends IsNumbers<infer N1, infer N2>
        ? Op extends '+'
            ? WrapMathResult<Add<N1, N2>, Env>
            : Op extends '-'
                ? WrapMathResult<Sub<N1, N2>, Env>
                : Op extends '*'
                    ? WrapMathResult<Mul<N1, N2>, Env>
                    : Op extends '/'
                        ? WrapMathResult<Div<N1, N2>, Env>
                        : Op extends '%'
                            ? WrapMathResult<Mod<N1, N2>, Env>
                            : Op extends '<'
                                ? WrapMathResult<LT<N1, N2>, Env>
                                : Op extends '>'
                                    ? WrapMathResult<GT<N1, N2>, Env>
                                    : Op extends '<='
                                        ? WrapMathResult<LTE<N1, N2>, Env>
                                        : Op extends '>='
                                            ? WrapMathResult<GTE<N1, N2>, Env>
                                            : RuntimeError<`Unknown binary operator: ${Op}`>
        : RuntimeError<`EvalMath fail, Left or Right is not a number: left:${ExtractError<LV>}, right:${ExtractError<RR>}`>
    : RR; // error

type WrapMathResult<V, Env extends Environment> =
    V extends ValueType
        ? InterpretExprSuccess<V, Env>
        : ExtractError<V>;

type ExtractError<E> =
    E extends { error: infer M extends string }
        ? M
        : Safe<E, string | number | boolean | null | undefined>;

import { FunObject } from "../FunObject";
import { AssignExpr, BinaryExpr, CallExpr, Expr, GroupExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../parser/Expr";
import { TokenLike } from "../parser/utils";
import { NoWay, SuccessResult } from "../Result";
import { Token } from "../scanner/Token";
import { TokenType, ValueType } from "../type";
import { EQ, Safe } from "../utils/common";
import { Inverse, IsTrue } from "../utils/logic";
import { Div, GT, GTE, LT, LTE, Mod, Mul, Sub } from "../utils/math/simple/math";
import { Add } from "../utils/math/fast/add";
import { BuildEnv, EnvAssign, EnvDefine, EnvGet, Environment } from "./Environment";
import { InterpretBlockStmt, InterpretStmtSuccess } from "./InterpretStmt";
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
                            : E extends CallExpr
                                ? EvalCallExpr<E, Env>
                                : RuntimeError<`Unknown expression type: ${E['type']}`>;

type EvalCallExpr<
    E extends CallExpr,
    Env extends Environment,
    CV = InterpretExpr<E['callee'], Env>
> = CV extends InterpretExprSuccess<infer Callee, infer Env>
    ? Callee extends FunObject
        ? Callee['declaration']['parameters']['length'] extends E['arguments']['length']
            ? InjectArgsToEnv<Callee['declaration']['parameters'], E['arguments'], Env, BuildEnv<{}, Callee['environment']>> extends infer EE
                ? EE extends InjectArgsToEnvSuccess<infer CallerEnv, infer FunScopeEnv>
                    ? InterpretBlockStmt<Callee['declaration']['body']['stmts'], FunScopeEnv> extends infer BR
                        ? BR extends InterpretStmtSuccess<infer BV, infer Env>
                            ? InterpretStmtSuccess<BV, CallerEnv> // 函数body执行完要回到CallerEnv
                            : BR // error
                        : NoWay<'EvalCallExpr-InterpretBlockStmt'>
                    : EE // error
                : NoWay<'EvalCallExpr-InjectArgsToEnv'>
            : RuntimeError<'Arguments length not match parameters.'>
        : RuntimeError<`Callee must be a 'FunObject', but got: ${Safe<Callee, Exclude<ValueType, FunObject>>}`>
    : CV; // error

type InjectArgsToEnv<
    Params extends Token[],
    Args extends Expr[],
    CallerEnv extends Environment,
    FunScopeEnv extends Environment,
> = Params extends [infer P1 extends TokenLike<{ type: 'identifier'}>, ...infer RestParams extends Token[]]
        ? Args extends [infer A1 extends Expr, ...infer RestArgs extends Expr[]]
            ? InterpretExpr<A1, CallerEnv> extends infer PV
                ? PV extends InterpretExprSuccess<infer V, infer CallerEnv>
                    ? EnvDefine<FunScopeEnv, P1['lexeme'], V> extends infer FunScopeEnv
                        ? FunScopeEnv extends Environment
                            ? InjectArgsToEnv<RestParams, RestArgs, CallerEnv, FunScopeEnv>
                            : FunScopeEnv // error
                        : NoWay<'InjectArgsToEnv-EnvDefine'>
                    : PV // error
                : NoWay<'InjectArgsToEnv-InterpretExpr'>
            : RuntimeError<'No way here, params and args must match here!'>
        : InjectArgsToEnvSuccess<CallerEnv, FunScopeEnv>;
type InjectArgsToEnvSuccess<
    CallerEnv extends Environment,
    FunScopeEnv extends Environment,
> = SuccessResult<{ callerEnv: CallerEnv, funScopeEnv: FunScopeEnv }>;

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
                : EvalRestBinaryExpr<Op, LV, InterpretExpr<Right, Env>, Env>
        : LR; // error

type EvalLogicAndOr<
    Op extends '&&' | '||',
    LV extends ValueType,
    Right extends Expr,
    Env extends Environment
> = Op extends '&&'
    ? IsTrue<LV> extends true
        ? InterpretExpr<Right, Env>
        : InterpretExprSuccess<LV, Env>
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
        ? InterpretExprSuccess<EQ<LV, RV>, Safe<Env, Environment>>
        : Op extends '!='
            ? InterpretExprSuccess<Inverse<EQ<LV, RV>>, Env>
            : RuntimeError<`EvalEquality fail when meet: ${Op}`>
    : RR; // error

type IsStrings<N1 extends string, N2 extends string> = [N1, N2];
type IsNumbers<N1 extends number, N2 extends number> = [N1, N2];
type EvalRestBinaryExpr<
    Op extends TokenType,
    LV extends ValueType,
    RR,
    Env extends Environment, // 不需要，但是为了一致，没去掉
> = RR extends InterpretExprSuccess<infer RV, infer Env>
    ? Op extends '+'
        ? [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? WrapBinaryResult<Add<N1, N2>, Env>
            : [LV, RV] extends IsStrings<infer N1, infer N2>
                ? WrapBinaryResult<`${N1}${N2}`, Env>
                : RuntimeError<'"+" operator only support both operand is string or number.'>
        : [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? EvalMath<Op, N1, N2, Env>
            : RuntimeError<`EvalRestBinaryExpr fail, Left or Right is not a number: left:${ExtractError<LV>}, right:${ExtractError<RR>}`>
    : RR; // error

type EvalMath<
    Op extends TokenType,
    N1 extends number,
    N2 extends number,
    Env extends Environment,
> = Op extends '-'
    ? WrapBinaryResult<Sub<N1, N2>, Env>
    : Op extends '*'
        ? WrapBinaryResult<Mul<N1, N2>, Env>
        : Op extends '/'
            ? WrapBinaryResult<Div<N1, N2>, Env>
            : Op extends '%'
                ? WrapBinaryResult<Mod<N1, N2>, Env>
                : Op extends '<'
                    ? WrapBinaryResult<LT<N1, N2>, Env>
                    : Op extends '>'
                        ? WrapBinaryResult<GT<N1, N2>, Env>
                        : Op extends '<='
                            ? WrapBinaryResult<LTE<N1, N2>, Env>
                            : Op extends '>='
                                ? WrapBinaryResult<GTE<N1, N2>, Env>
                                : RuntimeError<`Unknown binary operator: ${Op}`>;

type WrapBinaryResult<V, Env extends Environment> =
    V extends ValueType
        ? InterpretExprSuccess<V, Env>
        : ExtractError<V>;

type ExtractError<E> =
    E extends { error: infer M extends string }
        ? M
        : Safe<E, string | number | boolean | null | undefined>;

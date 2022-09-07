import { BinaryExpr, Expr, GroupExpr, LiteralExpr, UnaryExpr } from "../parser/Expr";
import { TokenType } from "../scanner/Token";
import { EQ, Safe } from "../utils/common";
import { Inverse, IsTrue } from "../utils/logic";
import { Add, Div, GT, GTE, LT, LTE, Mod, Mul, Sub } from "../utils/math";
import { RuntimeError } from './RuntimeError';


export type InterpretExpr<E extends Expr> =
    E extends LiteralExpr
        ? E['value']
        : E extends GroupExpr
            ? InterpretExpr<E['expression']>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E>
                    : RuntimeError<`Unknown expression type: ${E['type']}`>;

// type tInterPret = Interpret<B>;

type EvalUnaryExpr<
    E extends UnaryExpr,
    Op extends TokenType = E['operator']['type'],
    V = InterpretExpr<E['expression']>
> = Op extends '!'
    ? Inverse<V>
    : RuntimeError<`Unknown unary operator: ${Op}`>;


type EvalBinaryExpr<
    E extends BinaryExpr,
    Op extends TokenType = E['operator']['type'],
    Left = InterpretExpr<E['left']>
    // 不能直接求值 Right, 因为 && || 有短路的效果。
> =
    Op extends '==' | '!='
        ? EvalEquality<Op, Left, InterpretExpr<E['right']>>
        : Op extends '&&' | '||'
            ? EvalLogicAndOr<Op, E['left'], E['right'], Left>
            : EvalMath<Op, Left, InterpretExpr<E['right']>>;

type EvalLogicAndOr<
    Op extends '&&' | '||',
    Left extends Expr,
    Right extends Expr,
    LeftVal = InterpretExpr<Left>
> =
    Op extends '&&'
        ? IsTrue<LeftVal> extends true
            ? LeftVal
            : InterpretExpr<Right>
        : Op extends '||'
            ? IsTrue<LeftVal> extends true
                ? LeftVal
                : InterpretExpr<Right>
            : RuntimeError<`EvalLogicAndOr fail when meet: ${Op}`>

type EvalEquality<Op extends '==' | '!=', Left, Right> =
    Op extends '=='
        ? EQ<Left, Right>
        : Op extends '!='
            ? Inverse<EQ<Left, Right>>
            : RuntimeError<`EvalEquality fail when meet: ${Op}`>

type IsNumbers<N1 extends number, N2 extends number> = [N1, N2];
// type t = [1, 2] extends IsNumbers<infer A, infer B> ? A : never;
type EvalMath<Op extends TokenType, Left, Right> =
[Left, Right] extends IsNumbers<infer N1, infer N2>
    ? Op extends '+'
        ? Add<N1, N2>
        : Op extends '-'
            ? Sub<N1, N2>
            : Op extends '*'
                ? Mul<N1, N2>
                : Op extends '/'
                    ? Div<N1, N2>
                    : Op extends '%'
                        ? Mod<N1, N2>
                        : Op extends '<'
                            ? LT<N1, N2>
                            : Op extends '>'
                                ? GT<N1, N2>
                                : Op extends '<='
                                    ? LTE<N1, N2>
                                    : Op extends '>='
                                        ? GTE<N1, N2>
                                        : RuntimeError<`Unknown binary operator: ${Op}`>
    : RuntimeError<`EvalMath fail, Left or Right is not a number: left:${ExtractError<Left>}, right:${ExtractError<Right>}`>;

type ExtractError<E> = E extends { error: infer M extends string } ? M : Safe<E, string | number | boolean | null | undefined>;

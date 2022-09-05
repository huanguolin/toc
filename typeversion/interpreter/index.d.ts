import { BinaryExpr, Expr, GroupExpr, LiteralExpr, UnaryExpr } from "../parser/Expr";
import { TokenType } from "../scanner/Token";
import { Inverse } from "../utils/logic";
import { Add, Div, GT, GTE, LT, LTE, Mod, Mul, Sub } from "../utils/math";
import { RuntimeError } from './RuntimeError';


export type Interpret<E extends Expr> =
    E extends LiteralExpr
        ? E['value']
        : E extends GroupExpr
            ? Interpret<E['expression']>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E>
                    : RuntimeError<`Unknown expression type: ${E['type']}`>;

// type tInterPret = Interpret<B>;

type EvalUnaryExpr<
    E extends UnaryExpr,
    Op extends TokenType = E['operator']['type'],
    V = Interpret<E['expression']>
> = Op extends '!'
    ? Inverse<V>
    : RuntimeError<`Unknown unary operator: ${Op}`>;


type EvalBinaryExpr<
    E extends BinaryExpr,
    Op extends TokenType = E['operator']['type'],
    Left = Interpret<E['left']>,
    Right = Interpret<E['right']>
> =
    Left extends number
        ? Right extends number
            ? EvalMath<Op, Left, Right>
            : RuntimeError<`Right is not a number: ${ExtractError<Left>}`>
        : RuntimeError<`Left is not a number: ${ExtractError<Right>}`>;


type ExtractError<E> = E extends { error: infer M extends string } ? M : 'Extract error fail.';

type EvalMath<Op extends TokenType, Left extends number, Right extends number> =
    Op extends '+'
        ? Add<Left, Right>
        : Op extends '-'
            ? Sub<Left, Right>
            : Op extends '*'
                ? Mul<Left, Right>
                : Op extends '/'
                    ? Div<Left, Right>
                    : Op extends '%'
                        ? Mod<Left, Right>
                        : Op extends '<'
                            ? LT<Left, Right>
                            : Op extends '>'
                                ? GT<Left, Right>
                                : Op extends '<='
                                    ? LTE<Left, Right>
                                    : Op extends '>='
                                        ? GTE<Left, Right>
                                        : RuntimeError<`Unknown binary operator: ${Op}`>;
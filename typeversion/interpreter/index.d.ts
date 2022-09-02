import { BinaryExpr, Expr, GroupExpr, LiteralExpr } from "../parser/Expr";
import { ErrorResult } from "../Result";
import { Token, TokenType } from "../scanner/Token";
import { Safe } from "../utils/common";
import { Add, Div, Mul, Sub } from "../utils/math";
import { RuntimeError } from './RuntimeError';


export type Interpret<E extends Expr> =
    E extends GroupExpr
        ? Interpret<E['expr']>
        : E extends LiteralExpr
            ? E['value']
            : E extends BinaryExpr
                ? EvalBinaryExpr<E>
                : RuntimeError<`Unknown expression type: ${E['type']}`>;

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
                    : RuntimeError<`Unknown binary operator: ${Safe<Op, string>}`>;
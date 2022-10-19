/**
 * 目前只支持正整数运算。
 *
 * ref: https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */

import { ErrorResult } from "../../../Result";
import { Concat, Drop, Init, Length, Push } from "../../array";
import { Eq, Safe } from "../../common";
import { Inverse } from "../../logic";

export type Add<N1 extends number, N2 extends number> = Length<Concat<Init<N1>, Init<N2>>>;
export type Sub<N1 extends number, N2 extends number> = Length<Drop<Init<N1>, N2>>;
export type Mul<N1 extends number, N2 extends number, A1 extends any[] = [], A2 extends any[] = []> =
    N1 extends 0
        ? 0
        : N2 extends 0
            ? 0
            : Length<A1> extends N1
                ? Length<A2>
                : Mul<N1, N2, Push<A1, any>, Concat<A2, Init<N2>>>;

/**
 * 类似 C 语言的整数除法：
 * Div<9, 3> = 3
 * Div<9, 4> = 2
 */
export type Div<
    N1 extends number,
    N2 extends number,
    A1 extends any[] = Init<N1>,
    A2 extends any[] = []
> =
    N2 extends 0
        ? ErrorResult<'The divisor cannot be 0'>
        : N1 extends 0
            ? 0
            : LT<Length<A1>, N2> extends true
                ? Length<A2>
                : Div<N1, N2, Drop<A1, N2>, Push<A2, any>>;

export type Mod<
    N1 extends number,
    N2 extends number,
    A1 extends any[] = Init<N1>,
    A2 extends any[] = []
> =
    N2 extends 0
        ? N2
        : N1 extends 0
            ? 0
            : LT<Length<A1>, N2> extends true
                ? Length<A1>
                : Mod<N1, N2, Drop<A1, N2>, Push<A2, any>>;


export type LT<
    N1 extends number,
    N2 extends number,
> = N1 extends N2
    ? false
    : N1 extends 0
        ? true
        : N2 extends 0
            ? false
            : LT<Safe<Sub<N1, 1>, number>, Safe<Sub<N2, 1>, number>>;


export type GT<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? false
        : Inverse<LT<N1, N2>>;

export type LTE<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? true
        : LT<N1, N2>;

export type GTE<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? true
        : Inverse<LT<N1, N2>>;
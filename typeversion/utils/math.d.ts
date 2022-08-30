/**
 * ref: https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */

import { Concat, Drop, Init, Length, Push } from "./array";


export type Add<N1 extends number, N2 extends number> = Length<Concat<Init<N1>, Init<N2>>>;

export type Sub<N1 extends number, N2 extends number, A1 extends any[] = Init<N1>, A2 extends any[] = []> =
    Length<A2> extends N2
        ? Length<A1>
        : Sub<N1, N2, Drop<A1>, Push<A2, any>>;

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
export type Div<N1 extends number, N2 extends number, A1 extends any[] = Init<N1>, A2 extends any[] = []> =
    N2 extends 0
        ? never
        : N1 extends 0
            ? 0
            : A1 extends never
                ? Length<Drop<A2>>
                : Length<A1> extends 0
                    ? Length<A2>
                    : Div<N1, N2, Drop<A1, N2>, Push<A2, any>>;

type tDiv = Div<9, 4>;
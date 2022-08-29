import { Concat, Drop, Init, Push } from "./array";

export type Plus<N1 extends number, N2 extends number> = Concat<Init<N1>, Init<N2>>['length'];

export type Minus<N1 extends number, N2 extends number, A1 extends any[] = Init<N1>, A2 extends any[] = []> =
    A2['length'] extends N2
        ? A1['length']
        : Minus<N1, N2, Drop<A1>, Push<A2, 0>>;

export type Mul<N1 extends number, N2 extends number, A1 extends any[] = [], A2 extends any[] = []> =
    N1 extends 0
        ? 0
        : N2 extends 0
            ? 0
            : A1['length'] extends N1
                ? A2['length']
                : Mul<N1, N2, Push<A1, 0>, Concat<A2, Init<N2>>>;

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
                ? Drop<A2>['length']
                : A1['length'] extends 0
                    ? A2['length']
                    : Div<N1, N2, Drop<A1, N2>, Push<A2, 0>>;

type tDiv = Div<3, 1>;
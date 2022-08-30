export type Length<T extends any[]> = T['length'];

type tLen = Length<[1, 23]>;

export type Push<A extends any[], E> = [...A, E];

export type Drop<A extends any[], N extends number = 1> =
    A extends [...(infer R extends any[]), ...Init<N>]
        ? R
        : never;

type t = Drop<[1, 2, 3], 4>;

export type Concat<A1 extends any[], A2 extends any[]> = [...A1, ...A2];

export type Init<L extends number, E extends any = any, A extends any[] = []> =
    Length<A> extends L
        ? A
        : Init<L, E, Push<A, E>>;
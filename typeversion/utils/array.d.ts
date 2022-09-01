export type Length<T extends any[]> = T['length'];

type tLen = Length<[1, 23]>;

export type Push<A extends any[], E> = [...A, E];
export type Pop<A extends any[]> = A extends [...infer P, infer E] ? E : never;

type tPop = Pop<[]>;

export type Drop<A extends any[], N extends number = 1> =
    A extends [...(infer R extends any[]), ...Init<N>]
        ? R
        : [];

type t = Drop<[1, 2, 3], 2>;

export type Slice<A extends any[], I extends number> =
    A extends [...Init<I>, ...(infer R extends any[])]
        ? R
        : [];
type tSlice = Slice<[0, 1, 2, 3], 4>;

export type Concat<A1 extends any[], A2 extends any[]> = [...A1, ...A2];

export type Init<L extends number, E extends any = any, A extends any[] = []> =
    Length<A> extends L
        ? A
        : Init<L, E, Push<A, E>>;

export type Contains<A extends any[], E extends any, > =
    Length<A> extends 0
        ? false
        : E extends Pop<A>
            ? true
            : Contains<Drop<A>, E>;

type tContains1 = Contains<[1, 2, 3], 3>;
type tContains2 = Contains<[1, 2, 3], 4>;

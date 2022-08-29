export type Push<A extends any[], E> = [...A, E];

type DropOne<A extends any[]> = A extends [any, ...infer R] ? R : never;

export type Drop<A extends any[], N extends number = 1, AC extends any[] = []> =
    N extends AC['length']
        ? A
        : Drop<DropOne<A>, N, Push<AC, 0>>;

type t = Drop<[1, 2, 3], 4>;

export type Concat<A1 extends any[], A2 extends any[]> = [...A1, ...A2];

export type Init<L extends number, E = 0, A extends any[] = []> = A['length'] extends L
    ? A
    : Init<L, E, Push<A, E>>;
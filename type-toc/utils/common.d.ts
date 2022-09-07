
export type EQ<A, B> =
    A extends B
    ? (B extends A ? true : false)
    : false;

export type Safe<T, Type, Default extends Type = Type> = T extends Type ? T : Default;

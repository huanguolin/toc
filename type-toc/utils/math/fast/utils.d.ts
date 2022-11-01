import { Safe } from '../../common';
import { NumChars } from '../../string';

export type ToNumChars<N extends number> = Safe<
    ToNumCharsBody<`${N}`, []>,
    NumChars[]
>;
type ToNumCharsBody<
    S extends string,
    R extends string[] = [],
> = S extends `${infer NC}${infer Rest}` ? ToNumCharsBody<Rest, [...R, NC]> : R;

export type ToNumber<N extends NumChars[], R extends string = ''> = N extends [
    infer NC extends NumChars,
    ...infer Rest extends NumChars[],
]
    ? ToNumber<Rest, `${R}${NC}`>
    : R extends `${infer NR extends number}`
    ? NR
    : `ToNumber Error: can not convert '${R}' to number.`;

export type TrimZeroStart<N extends NumChars[]> = N extends [
    '0',
    ...infer R extends NumChars[],
]
    ? TrimZeroStart<R>
    : N extends []
    ? ['0'] // Keep one at least.
    : N;

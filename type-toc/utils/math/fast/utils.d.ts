import { Safe } from "../../common";
import { NumChars, Str2Num, NumStr } from "../../string";

export type ToNumChars<
    N extends number,
    R extends NumChars[] = [],
> = `${N}` extends `${infer NC extends NumChars}${infer Rest extends string}`
    ? ToNumChars<Str2Num<Safe<Rest, NumStr>>, [...R, NC]>
    : R;

export type ToNumber<
    N extends NumChars[],
    R extends string = '',
> = N extends [infer NC extends NumChars, ...infer Rest extends NumChars[]]
    ? ToNumber<Rest, `${R}${NC}`>
    : R extends `${infer NR extends number}`
        ? NR
        : `ToNumber Error: can not convert '${R}' to number.`;

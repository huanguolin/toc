/**
 * 目前只支持正整数运算。
 */

import { Safe } from "../../common";

import { Add } from "./add";
import { Gte } from "./compare";
import { Sub } from "./sub";

export type Div<
    N1 extends number,
    N2 extends number,
> = N2 extends 0
    ? never
    : DivBody<N1, N2>;
type DivBody<
    Dividend extends number,
    Divisor extends number,
    R extends number = 0,
> = Gte<Dividend, Divisor> extends true
    ? DivBody<Safe<Sub<Dividend, Divisor>, number>, Divisor, Safe<Add<R, 1>, number>>
    : R;
/**
 * 目前只支持正整数运算。
 */

import { Safe } from "../../common";

import { Add } from "./add";
import { GT } from "./compare";
import { Sub } from "./sub";

export type Mul<
    N1 extends number,
    N2 extends number,
> = GT<N1, N2> extends true
    ? MulBody<N1, N2>
    : MulBody<N2, N1>;
type MulBody<
    G extends number,
    L extends number,
    R extends number = 0,
> = L extends 0
    ? R
    : MulBody<G, Safe<Sub<L, 1>, number>, Safe<Add<R, G>, number>>;
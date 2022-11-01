/**
 * 目前只支持正整数运算。
 */

import { Safe } from '../../common';

import { Gte } from './compare';
import { Sub } from './sub';

export type Mod<N1 extends number, N2 extends number> = N2 extends 0
    ? never
    : ModBody<N1, N2>;
type ModBody<Dividend extends number, Divisor extends number> = Gte<
    Dividend,
    Divisor
> extends true
    ? ModBody<Safe<Sub<Dividend, Divisor>, number>, Divisor>
    : Dividend;

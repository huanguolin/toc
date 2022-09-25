import { LT, LTE } from '../../utils/math/fast/compare';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    // LT
    Expect<Equal<LT<0, 0>, false>>,
    Expect<Equal<LT<1, 3>, true>>,
    Expect<Equal<LT<9, 1>, false>>,
    Expect<Equal<LT<99, 99>, false>>,
    Expect<Equal<LT<99, 100>, true>>,
    Expect<Equal<LT<450, 333>, false>>,
    Expect<Equal<LT<330, 333>, true>>,

    // LTE
    Expect<Equal<LTE<0, 0>, true>>,
    Expect<Equal<LTE<1, 3>, true>>,
    Expect<Equal<LTE<9, 1>, false>>,
    Expect<Equal<LTE<99, 99>, true>>,
    Expect<Equal<LTE<99, 100>, true>>,
    Expect<Equal<LTE<450, 333>, false>>,
    Expect<Equal<LTE<330, 333>, true>>,
];

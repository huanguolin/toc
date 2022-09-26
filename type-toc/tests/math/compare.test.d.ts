import { LT, GT, LTE, GTE } from '../../utils/math/fast/compare';
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

    // GT
    Expect<Equal<GT<0, 0>, false>>,
    Expect<Equal<GT<3, 1>, true>>,
    Expect<Equal<GT<1, 9>, false>>,
    Expect<Equal<GT<99, 99>, false>>,
    Expect<Equal<GT<100, 99>, true>>,
    Expect<Equal<GT<333, 450>, false>>,
    Expect<Equal<GT<333, 330>, true>>,

    // LTE
    Expect<Equal<LTE<0, 0>, true>>,
    Expect<Equal<LTE<1, 3>, true>>,
    Expect<Equal<LTE<9, 1>, false>>,
    Expect<Equal<LTE<99, 99>, true>>,
    Expect<Equal<LTE<99, 100>, true>>,
    Expect<Equal<LTE<450, 333>, false>>,
    Expect<Equal<LTE<330, 333>, true>>,

    // GTE
    Expect<Equal<GTE<0, 0>, true>>,
    Expect<Equal<GTE<3, 1>, true>>,
    Expect<Equal<GTE<1, 9>, false>>,
    Expect<Equal<GTE<99, 99>, true>>,
    Expect<Equal<GTE<100, 99>, true>>,
    Expect<Equal<GTE<333, 450>, false>>,
    Expect<Equal<GTE<333, 330>, true>>,
];

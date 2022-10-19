import { Lt, Gt, Lte, Gte } from '../../utils/math/fast/compare';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    // Lt
    Expect<Equal<Lt<0, 0>, false>>,
    Expect<Equal<Lt<1, 3>, true>>,
    Expect<Equal<Lt<9, 1>, false>>,
    Expect<Equal<Lt<99, 99>, false>>,
    Expect<Equal<Lt<99, 100>, true>>,
    Expect<Equal<Lt<450, 333>, false>>,
    Expect<Equal<Lt<330, 333>, true>>,

    // Gt
    Expect<Equal<Gt<0, 0>, false>>,
    Expect<Equal<Gt<3, 1>, true>>,
    Expect<Equal<Gt<1, 9>, false>>,
    Expect<Equal<Gt<99, 99>, false>>,
    Expect<Equal<Gt<100, 99>, true>>,
    Expect<Equal<Gt<333, 450>, false>>,
    Expect<Equal<Gt<333, 330>, true>>,

    // Lte
    Expect<Equal<Lte<0, 0>, true>>,
    Expect<Equal<Lte<1, 3>, true>>,
    Expect<Equal<Lte<9, 1>, false>>,
    Expect<Equal<Lte<99, 99>, true>>,
    Expect<Equal<Lte<99, 100>, true>>,
    Expect<Equal<Lte<450, 333>, false>>,
    Expect<Equal<Lte<330, 333>, true>>,

    // Gte
    Expect<Equal<Gte<0, 0>, true>>,
    Expect<Equal<Gte<3, 1>, true>>,
    Expect<Equal<Gte<1, 9>, false>>,
    Expect<Equal<Gte<99, 99>, true>>,
    Expect<Equal<Gte<100, 99>, true>>,
    Expect<Equal<Gte<333, 450>, false>>,
    Expect<Equal<Gte<333, 330>, true>>,
];

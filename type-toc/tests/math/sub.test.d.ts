import { Sub } from '../../utils/math/fast/sub';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    Expect<Equal<Sub<0, 0>, 0>>,
    Expect<Equal<Sub<1, 3>, 0>>,
    Expect<Equal<Sub<10, 1>, 9>>,
    Expect<Equal<Sub<10, 9>, 1>>,
    Expect<Equal<Sub<20, 19>, 1>>,
    Expect<Equal<Sub<100, 40>, 60>>,
    Expect<Equal<Sub<138, 39>, 99>>,
    Expect<Equal<Sub<450, 333>, 117>>,
    Expect<Equal<Sub<1000, 999>, 1>>,
    Expect<Equal<Sub<999, 999>, 0>>,
];

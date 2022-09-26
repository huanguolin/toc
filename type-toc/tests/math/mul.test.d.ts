import { Mul } from '../../utils/math/fast/mul';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    Expect<Equal<Mul<0, 0>, 0>>,
    Expect<Equal<Mul<0, 3>, 0>>,
    Expect<Equal<Mul<10, 0>, 0>>,
    Expect<Equal<Mul<1, 66>, 66>>,
    Expect<Equal<Mul<100, 17>, 1700>>,
    Expect<Equal<Mul<7, 123>, 861>>,
    Expect<Equal<Mul<12345, 321>, 3962745>>,
];

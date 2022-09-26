import { Mod } from '../../utils/math/fast/mod';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    // @ts-expect-error
    Expect<Equal<Mod<1, 0>, 0>>,
    Expect<Equal<Mod<0, 3>, 0>>,
    Expect<Equal<Mod<1, 6>, 1>>,
    Expect<Equal<Mod<10, 3>, 1>>,
    Expect<Equal<Mod<99, 88>, 11>>,
    Expect<Equal<Mod<861, 123>, 0>>,
    Expect<Equal<Mod<1700, 17>, 0>>,
    Expect<Equal<Mod<3962745, 12345>, 0>>,
];

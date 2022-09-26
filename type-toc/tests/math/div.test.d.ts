import { Div } from '../../utils/math/fast/div';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    // @ts-expect-error
    Expect<Equal<Div<1, 0>, 0>>,
    Expect<Equal<Div<0, 3>, 0>>,
    Expect<Equal<Div<1, 6>, 0>>,
    Expect<Equal<Div<10, 3>, 3>>,
    Expect<Equal<Div<861, 123>, 7>>,
    Expect<Equal<Div<1700, 17>, 100>>,
    Expect<Equal<Div<3962745, 12345>, 321>>,
];

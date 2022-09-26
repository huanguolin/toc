import { Add } from '../../utils/math/fast/add';
import type { Equal, Expect } from '../utils';

// expect error can use @ts-expect-error

type cases = [
    Expect<Equal<Add<0, 0>, 0>>,
    Expect<Equal<Add<1, 3>, 4>>,
    Expect<Equal<Add<1, 9>, 10>>,
    Expect<Equal<Add<21, 19>, 40>>,
    Expect<Equal<Add<69, 31>, 100>>,
    Expect<Equal<Add<100, 17>, 117>>,
    Expect<Equal<Add<123, 123>, 246>>,
    Expect<Equal<Add<369, 123>, 492>>,
    Expect<Equal<Add<669, 321>, 990>>,
    Expect<Equal<Add<450, 333>, 783>>,
    Expect<Equal<Add<1000, 999>, 1999>>,
    Expect<Equal<Add<999, 999>, 1998>>,
    Expect<Equal<Add<1, 999>, 1000>>,
    Expect<Equal<Add<24690, 12345>, 37035>>,
];

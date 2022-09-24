import type { Equal, Expect } from './utils';
import { Toc } from '..';

// expect error can use @ts-expect-error

type cases = [
    // for statement
    Expect<Equal<Toc<`
        var x = 0;
        for (;false;)
            x = x + 8;
        x;
    `>, 0>>,
    Expect<Equal<Toc<`
        var x = 0;
        for (var i = 1; i < 5; i=i+1)
            x = x + i;
        x;
    `>, 10>>,
    // Type instantiation is excessively deep and possibly infinite
    // Expect<Equal<Toc<`
    //     var x = 0;
    //     var i = 1;
    //     for (; i < 5; i=i+1)
    //         x = x + i;
    // `>, 10>>,

    // string
    Expect<Equal<Toc<`
        "";
    `>, ''>>,
    Expect<Equal<Toc<`
        "\\"";
    `>, '"'>>,
    Expect<Equal<Toc<`
        "\n";
    `>, '\n'>>,
    Expect<Equal<Toc<`
        "456" + "123";
    `>, '456123'>>,
    // @ts-expect-error Runtime Error
    Expect<Equal<Toc<`
        "456" + 123;
    `>, 'error'>>,
];

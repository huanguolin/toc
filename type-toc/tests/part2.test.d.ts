import { Toc } from '..';

import type { Equal, Expect } from './utils';

// expect error can use @ts-expect-error

type cases = [
    // block scope
    Expect<Equal<Toc<`
        var b = 4;
        {
            var a= b = 3;
        }
    `>, 3>>,
    Expect<Equal<Toc<`
        var b = 4;
        {
            var b = 3;
            b = 99;
        }
        var c = b + 12;
    `>, 16>>,
    Expect<Equal<Toc<`{}`>, null>>,
    // @ts-expect-error require '}' to close block statement.
    Expect<Equal<Toc<`{`>, null>>,

    // if statement
    Expect<Equal<Toc<`
        var b = 4;
        if (b > 3) b = 1995;
    `>, 1995>>,
    Expect<Equal<Toc<`
        var b = 0;
        if (b > 3) b = 1995;
    `>, null>>,
    Expect<Equal<Toc<`
        var b = 0;
        if (b > 3) b = 1995;
        else b = false;
    `>, false>>,
    Expect<Equal<Toc<`
        if (true) var b = 1;
        else var b = false;
    `>, 1>>,
    Expect<Equal<Toc<`
        var a = 0;
        if (true) { var a = null; }
        else { var a = false; }
        a;
    `>, 0>>,
    Expect<Equal<Toc<`
        if (false) { }
        else { }
    `>, null>>,

    // fun declaration
    Expect<Equal<Toc<`
        fun a() {}
    `>, '<fun a()>'>>,
    Expect<Equal<Toc<`
        fun a() {}
        var b = 9;
    `>, 9>>,
    Expect<Equal<Toc<`
        fun a () { var a = 5;}
    `>, '<fun a()>'>>,
    Expect<Equal<Toc<`
        fun a () { var a = 5;}
        var b = 0;
        a;
    `>, '<fun a()>'>>,
    Expect<Equal<Toc<`
        fun a(p1, p2) { var a = 5;}
        a;
    `>, '<fun a(p1, p2)>'>>,

    // fun call expr
    Expect<Equal<Toc<`
        fun a() {}
        a();
    `>, null>>,
    Expect<Equal<Toc<`
        fun a(p1, p2) { var a = 5;}
        a(1, 2);
    `>, 5>>,
    // @ts-expect-error params and args length not match
    Expect<Equal<Toc<` fun a(p1, p2) { var a = 5;} a(); `>, 5>>,
    Expect<Equal<Toc<`
        var i = 0;
        fun a(p1, p2) {
            p1 + p2;
        }
        a(i = i+5, i = i+6);
        a(i, i);
    `>, 22>>,
    Expect<Equal<Toc<`
        var i = 0;
        fun a(p1) {
            var i = p1 + 5;
            i;
        }
        a(10);
        i;
    `>, 0>>,
    Expect<Equal<Toc<`
        fun incN(n) {
            fun inc(x) {
                x + n;
            }
        }
        var inc3 = incN(3);
        inc3(1);
    `>, 4>>,
];

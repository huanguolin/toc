import type { Equal, Expect } from './utils';
import { Toc } from '..';

// expect error can use @ts-expect-error

type cases = [
    // +, -
    Expect<Equal<Toc<'1 + 2;'>, 3>>,
    Expect<Equal<Toc<'0 + 999;'>, 999>>,
    Expect<Equal<Toc<'123 + 32;'>, 155>>,
    Expect<Equal<Toc<'999 - 1;'>, 998>>,
    Expect<Equal<Toc<'999 - 0;'>, 999>>,
    Expect<Equal<Toc<'999 - 991;'>, 8>>,
    Expect<Equal<Toc<'123 - 991;'>, 0>>,

    // *, /, %
    Expect<Equal<Toc<'1 * 135;'>, 135>>,
    Expect<Equal<Toc<'3 * 0;'>, 0>>,
    Expect<Equal<Toc<'3 * 123;'>, 369>>,
    Expect<Equal<Toc<'0 / 3;'>, 0>>,
    Expect<Equal<Toc<'1 / 3;'>, 0>>,
    Expect<Equal<Toc<'999 / 3;'>, 333>>,
    Expect<Equal<Toc<'8 % 3;'>, 2>>,
    Expect<Equal<Toc<'0 % 3;'>, 0>>,
    Expect<Equal<Toc<'2 % 3;'>, 2>>,

    // group
    Expect<Equal<Toc<'2 * (3 - 2);'>, 2>>,
    Expect<Equal<Toc<'2 * ((3 - 2) + 9);'>, 20>>,
    Expect<Equal<Toc<'(0);'>, 0>>,

    // !
    Expect<Equal<Toc<'!false;'>, true>>,
    Expect<Equal<Toc<'!true;'>, false>>,
    Expect<Equal<Toc<'!0;'>, true>>,
    Expect<Equal<Toc<'!null;'>, true>>,
    Expect<Equal<Toc<'!1;'>, false>>,
    Expect<Equal<Toc<'!!1;'>, true>>,

    // ==
    Expect<Equal<Toc<'0 == 0;'>, true>>,
    Expect<Equal<Toc<'3 == 3;'>, true>>,
    Expect<Equal<Toc<'false == false;'>, true>>,
    Expect<Equal<Toc<'true == true;'>, true>>,
    Expect<Equal<Toc<'null == null;'>, true>>,
    Expect<Equal<Toc<'5 == 9;'>, false>>,
    Expect<Equal<Toc<'false == 9;'>, false>>,
    Expect<Equal<Toc<'false == true;'>, false>>,
    Expect<Equal<Toc<'false == null;'>, false>>,
    Expect<Equal<Toc<'false == 0;'>, false>>,
    // !=
    Expect<Equal<Toc<'0 != 0;'>, false>>,
    Expect<Equal<Toc<'3 != 3;'>, false>>,
    Expect<Equal<Toc<'false != false;'>, false>>,
    Expect<Equal<Toc<'true != true;'>, false>>,
    Expect<Equal<Toc<'null != null;'>, false>>,
    Expect<Equal<Toc<'5 != 9;'>, true>>,
    Expect<Equal<Toc<'false != 9;'>, true>>,
    Expect<Equal<Toc<'false != true;'>, true>>,
    Expect<Equal<Toc<'false != null;'>, true>>,
    Expect<Equal<Toc<'false != 0;'>, true>>,

    // >
    Expect<Equal<Toc<'9 > 0;'>, true>>,
    Expect<Equal<Toc<'9 > 9;'>, false>>,
    Expect<Equal<Toc<'9 > 10;'>, false>>,
    // >=
    Expect<Equal<Toc<'9 >= 0;'>, true>>,
    Expect<Equal<Toc<'9 >= 9;'>, true>>,
    Expect<Equal<Toc<'9 >= 10;'>, false>>,
    // <
    Expect<Equal<Toc<'9 < 0;'>, false>>,
    Expect<Equal<Toc<'9 < 9;'>, false>>,
    Expect<Equal<Toc<'9 < 10;'>, true>>,
    // <=
    Expect<Equal<Toc<'9 <= 0;'>, false>>,
    Expect<Equal<Toc<'9 <= 9;'>, true>>,
    Expect<Equal<Toc<'9 <= 10;'>, true>>,

    // &&
    Expect<Equal<Toc<'9 && 10;'>, 10>>,
    Expect<Equal<Toc<'0 && 10;'>, 0>>,
    Expect<Equal<Toc<'true && false;'>, false>>,
    Expect<Equal<Toc<'var a = 0; a && (a = 5); a;'>, 0>>,
    Expect<Equal<Toc<'var a = 1; a && (a = 5); a;'>, 5>>,
    // ||
    Expect<Equal<Toc<'9 || 10;'>, 9>>,
    Expect<Equal<Toc<'0 || 10;'>, 10>>,
    Expect<Equal<Toc<'true || false;'>, true>>,
    Expect<Equal<Toc<'var a = 0; a || (a = 5); a;'>, 5>>,
    Expect<Equal<Toc<'var a = 1; a || (a = 5); a;'>, 1>>,

    // other
    Expect<Equal<Toc<'123 % 100 + 15 - 12 / 3 / ( 5 -3);'>, 36>>,
    Expect<Equal<Toc<'(5 -3 ) * 6 || 7 - ( 9 / 3 );'>, 12>>,


    // space
    Expect<Equal<Toc<'1+10;'>, 11>>,
    Expect<Equal<Toc<'    1 +10  ;  '>, 11>>,
    Expect<Equal<Toc<'\t  \n1 +\t10  ;  '>, 11>>,

    // var
    Expect<Equal<Toc<'var a; a;'>, null>>,
    Expect<Equal<Toc<'var a; a = !!a; a;'>, false>>,
    Expect<Equal<Toc<'var a = 3 + 9 % 5;'>, 7>>,
    Expect<Equal<Toc<'var a = 3 + 9 % 5; var b = a = 4 * 5 - 12 / 3;'>, 16>>,

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
            var a= b = 3;
            b = 99;
        }
        var c = b + 12;
    `>, 16>>,

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
];

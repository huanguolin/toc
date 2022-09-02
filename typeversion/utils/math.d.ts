/**
 * 目前只支持正整数运算。
 *
 * ref: https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */

import { ErrorResult } from "../Result";
import { Concat, Drop, Init, Length, Push } from "./array";
import { Safe } from "./common";
import { NumChars, NumStr, StrLength, ShiftChar } from "./string";


export type Add<N1 extends number, N2 extends number> = Length<Concat<Init<N1>, Init<N2>>>;

// export type Sub<N1 extends number, N2 extends number, A1 extends any[] = Init<N1>, A2 extends any[] = []> =
//     Length<A2> extends N2
//         ? Length<A1>
//         : Sub<N1, N2, Drop<A1>, Push<A2, any>>;
export type Sub<N1 extends number, N2 extends number> = Length<Drop<Init<N1>, N2>>;

type tSub = Sub<999, 99>;

export type Mul<N1 extends number, N2 extends number, A1 extends any[] = [], A2 extends any[] = []> =
    N1 extends 0
        ? 0
        : N2 extends 0
            ? 0
            : Length<A1> extends N1
                ? Length<A2>
                : Mul<N1, N2, Push<A1, any>, Concat<A2, Init<N2>>>;

/**
 * 类似 C 语言的整数除法：
 * Div<9, 3> = 3
 * Div<9, 4> = 2
 */
export type Div<
    N1 extends number,
    N2 extends number,
    A1 extends any[] = Init<N1>,
    A2 extends any[] = []
> =
    N2 extends 0
        ? ErrorResult<'The divisor cannot be 0'>
        : N1 extends 0
            ? 0
            : LT<Length<A1>, N2> extends true
                ? Length<A2>
                : Div<N1, N2, Drop<A1, N2>, Push<A2, any>>;

type tDiv = Div<333, 10>;

export type Mod<
    N1 extends number,
    N2 extends number,
    A1 extends any[] = Init<N1>,
    A2 extends any[] = []
> =
    N2 extends 0
        ? N2
        : N1 extends 0
            ? 0
            : LT<Length<A1>, N2> extends true
                ? Length<A1>
                : Mod<N1, N2, Drop<A1, N2>, Push<A2, any>>;
type tMod = Mod<333, 10>;


type LessThanMapping = {
    '0': '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9',
    '1': '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9',
    '2': '3' | '4' | '5' | '6' | '7' | '8' | '9',
    '3': '4' | '5' | '6' | '7' | '8' | '9',
    '4': '5' | '6' | '7' | '8' | '9',
    '5': '6' | '7' | '8' | '9',
    '6': '7' | '8' | '9',
    '7': '8' | '9',
    '8': '9',
    '9': never,
};

/**
 * 十位以内小于。
 */
type NumCharLT<
    D1 extends NumChars,
    D2 extends NumChars,
> = D2 extends LessThanMapping[D1] ? true : false;
// type tNumCharLT1 = NumCharLT<'6', '7'>;
// type tNumCharLT2 = NumCharLT<'7', '6'>;
// type tNumCharLT3 = NumCharLT<'1', '0'>;

type FirstChar<S extends NumStr> = Safe<ShiftChar<S>['char'], NumChars>;
type RestStr<S extends NumStr> = Safe<ShiftChar<S>['rest'], NumStr>;

/**
 * 位数相等时的小于。
 */
type StrNumLT<
    S1 extends NumStr,
    S2 extends NumStr,
    L1 = StrLength<S1>,
    L2 = StrLength<S2>
> = L1 extends L2
    ? L1 extends 1 // 只有一位，即可用十位以内小于比较(这一步是优化性能); 否则从高位逐位比较。
        ? NumCharLT<Safe<S1, NumChars>, Safe<S2, NumChars>>
        : NumCharLT<FirstChar<S1>, FirstChar<S2>> extends true
            ? true
            : StrNumLT<RestStr<S1>, RestStr<S2>>
    : `Error: two number string length not match.`;
type tStrNumLT = StrNumLT<'9999', '9998'>;


export type LT<
    N1 extends number,
    N2 extends number,
    L1 extends number = StrLength<`${N1}`>,
    L2 extends number = StrLength<`${N2}`>
> = N1 extends N2
    ? false
    : L1 extends L2
    ? StrNumLT<`${N1}`, `${N2}`> // 位数相等比较原数字
    : StrNumLT<`${L1}`, `${L2}`>; // 位数不想等比较位数数字
type tLT = LT<12345, 67891>;

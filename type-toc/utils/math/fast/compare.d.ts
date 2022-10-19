/**
 * 目前只支持正整数运算。
 */

import { Safe, Eq } from "../../common";
import { Inverse } from "../../logic";
import { NumChars, NumStr, ShiftChar, StrLength } from "../../string";


export type Lt<
    N1 extends number,
    N2 extends number,
    L1 extends number = StrLength<`${N1}`>,
    L2 extends number = StrLength<`${N2}`>
> = N1 extends N2
    ? false
    : L1 extends L2
        ? StrNumLT<`${N1}`, `${N2}`> // 位数相等比较原数字
        : StrNumLT<`${L1}`, `${L2}`>; // 位数不想等比较位数数字


export type Gt<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? false
        : Inverse<Lt<N1, N2>>;


export type Lte<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? true
        : Lt<N1, N2>;


export type Gte<N1 extends number, N2 extends number> =
    Eq<N1, N2> extends true
        ? true
        : Inverse<Lt<N1, N2>>;



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
        : Eq<FirstChar<S1>, FirstChar<S2>> extends true
            ? StrNumLT<RestStr<S1>, RestStr<S2>>
            : NumCharLT<FirstChar<S1>, FirstChar<S2>>
    : `StrNumLT Error: two number string length not match.`;


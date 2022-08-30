import { NewLineKind } from "typescript";
import { Contains, Slice } from "./array";
import { Add } from "./math";
import { DropChar, ShiftChar, Str2Num, StrLength } from "./string";

export type EQ<A, B> =
    A extends B
        ? (B extends A ? true : false)
        : false;

export type Cast<X, Y> = X extends Y ? X : never;

type GTArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * 十位以内小于。
 */
type StrCharLT<
    D1 extends string,
    D2 extends string,
    I extends number = Str2Num<D1>
> =
    EQ<D1, D2> extends true
        ? false
        : Contains<Slice<GTArr, I>, D2>;
type tStrCharLT1 = StrCharLT<'6', '7'>;
type tStrCharLT2 = StrCharLT<'7', '6'>;
type tStrCharLT3 = StrCharLT<'1', '0'>;

/**
 * 位数相等时的小于。
 */
type StrNumLT<
    S1 extends string,
    S2 extends string,
    L1 = StrLength<S1>,
    L2 = StrLength<S2>
> = L1 extends L2
    ? L1 extends 1
        ? StrCharLT<S1, S2>
        : StrCharLT<ShiftChar<S1>, ShiftChar<S2>> extends true
            ? true
            : StrNumLT<DropChar<S1>, DropChar<S2>>
    : never;
type tStrNumLT = StrNumLT<'199999', '999799'>;


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
export type tLT = LT<12345, 6789>;
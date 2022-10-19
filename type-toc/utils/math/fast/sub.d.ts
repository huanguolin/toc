/**
 * 目前只支持正整数运算。
 */

import { NumChars } from "../../string";

import { Lte } from "./compare";
import { ToNumber, ToNumChars, TrimZeroStart } from "./utils";

export type Sub<
    N1 extends number,
    N2 extends number,
> = Lte<N1, N2> extends true
    ? 0
    : SubCore<ToNumChars<N1>, ToNumChars<N2>> extends infer R
        ? R extends NumChars[]
            ? ToNumber<TrimZeroStart<R>>
            : R // error
        : never;

/**
 * Left -> 0 ~ 9
 * Right -> 0 ~ 9
 *
 * SubMap = {
 *  Left: [...Values]
 * };
 *
 * Left - Right = Value = SubMap[Left][Right]
 */
type SubMap = {
    '0': [AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>, AtomB<'5'>, AtomB<'4'>, AtomB<'3'>, AtomB<'2'>, AtomB<'1'>];
    '1': [AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>, AtomB<'5'>, AtomB<'4'>, AtomB<'3'>, AtomB<'2'>];
    '2': [AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>, AtomB<'5'>, AtomB<'4'>, AtomB<'3'>];
    '3': [AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>, AtomB<'5'>, AtomB<'4'>];
    '4': [AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>, AtomB<'5'>];
    '5': [AtomN<'5'>, AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>, AtomB<'6'>];
    '6': [AtomN<'6'>, AtomN<'5'>, AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>, AtomB<'7'>];
    '7': [AtomN<'7'>, AtomN<'6'>, AtomN<'5'>, AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>, AtomB<'8'>];
    '8': [AtomN<'8'>, AtomN<'7'>, AtomN<'6'>, AtomN<'5'>, AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>, AtomB<'9'>];
    '9': [AtomN<'9'>, AtomN<'8'>, AtomN<'7'>, AtomN<'6'>, AtomN<'5'>, AtomN<'4'>, AtomN<'3'>, AtomN<'2'>, AtomN<'1'>, AtomN<'0'>];
};

type SubAtom<
    Num extends NumChars,
    Borrow extends '0' | '1' = '0',
> = { num: Num, borrow: Borrow };

type AtomN<Num extends NumChars> = SubAtom<Num, '0'>;
type AtomB<Num extends NumChars> = SubAtom<Num, '1'>;

type SubNumChar<
    N1 extends NumChars,
    N2 extends NumChars,
    Borrow extends NumChars = '0',
> = SubMap[N1][N2] extends SubAtom<infer N, infer NB1>
    ? SubMap[N][Borrow] extends SubAtom<infer N, infer NB2>
        ? [NB1, NB2] extends ['0', '0']
            ? AtomN<N>
            : AtomB<N> // NB1, NB2 不可能同时为 '1'
        : never
    : `SubNumChar Error: invalid N1(${N1}) or N2(${N2}).`;

type SubCore<
    N1 extends NumChars[],
    N2 extends NumChars[],
    Result extends NumChars[] = [],
    Borrow extends NumChars = '0',
> = [N1, N2] extends [[], []]
    ? Result
    : N1 extends []
        ? never
        : N2 extends []
            ? SubCoreBorrow<N1, Result, Borrow>
            : [N1, N2] extends [[...infer Rest1 extends NumChars[], infer NC1 extends NumChars], [...infer Rest2 extends NumChars[], infer NC2 extends NumChars]]
                ? SubNumChar<NC1, NC2, Borrow> extends infer R
                    ? R extends SubAtom<infer N, infer B>
                        ? SubCore<Rest1, Rest2, [N, ...Result], B>
                        : R // error
                    : never
                : never;
type SubCoreBorrow<
    N extends NumChars[],
    Result extends NumChars[] = [],
    Borrow extends NumChars = '0',
> = Borrow extends '0'
    ? [...N, ...Result]
    : N extends [...infer Rest extends NumChars[], infer NC extends NumChars]
        ? SubNumChar<NC, Borrow> extends infer R
            ? R extends SubAtom<infer N, infer C>
                ? SubCoreBorrow<Rest, [N, ...Result], C>
                : R // error
            : never
        : never;


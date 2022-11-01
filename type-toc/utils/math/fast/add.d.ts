/**
 * 目前只支持正整数运算。
 */

import { Safe } from '../../common';
import { NumChars } from '../../string';

import { ToNumChars, ToNumber, TrimZeroStart } from './utils';

export type Add<N1 extends number, N2 extends number> = AddCore<
    ToNumChars<N1>,
    ToNumChars<N2>
> extends infer R
    ? R extends NumChars[]
        ? ToNumber<TrimZeroStart<R>>
        : R
    : never; // error

/**
 * Left -> 0 ~ 9
 * Right -> 0 ~ 9
 *
 * AddMap = {
 *  Left: [...Values]
 * };
 *
 * Left + Right = Value = AddMap[Left][Right]
 */
type AddMap = {
    '0': [
        AtomN<'0'>,
        AtomN<'1'>,
        AtomN<'2'>,
        AtomN<'3'>,
        AtomN<'4'>,
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
    ];
    '1': [
        AtomN<'1'>,
        AtomN<'2'>,
        AtomN<'3'>,
        AtomN<'4'>,
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
    ];
    '2': [
        AtomN<'2'>,
        AtomN<'3'>,
        AtomN<'4'>,
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
    ];
    '3': [
        AtomN<'3'>,
        AtomN<'4'>,
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
    ];
    '4': [
        AtomN<'4'>,
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
    ];
    '5': [
        AtomN<'5'>,
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
        AtomC<'4'>,
    ];
    '6': [
        AtomN<'6'>,
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
        AtomC<'4'>,
        AtomC<'5'>,
    ];
    '7': [
        AtomN<'7'>,
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
        AtomC<'4'>,
        AtomC<'5'>,
        AtomC<'6'>,
    ];
    '8': [
        AtomN<'8'>,
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
        AtomC<'4'>,
        AtomC<'5'>,
        AtomC<'6'>,
        AtomC<'7'>,
    ];
    '9': [
        AtomN<'9'>,
        AtomC<'0'>,
        AtomC<'1'>,
        AtomC<'2'>,
        AtomC<'3'>,
        AtomC<'4'>,
        AtomC<'5'>,
        AtomC<'6'>,
        AtomC<'7'>,
        AtomC<'8'>,
    ];
};

type AddAtom<Num extends NumChars, Carry extends '0' | '1' = '0'> = {
    num: Num;
    carry: Carry;
};

type AtomN<Num extends NumChars> = AddAtom<Num, '0'>;
type AtomC<Num extends NumChars> = AddAtom<Num, '1'>;

type AddNumChar<
    N1 extends NumChars,
    N2 extends NumChars,
    Carry extends NumChars = '0',
> = AddMap[N1][N2] extends AddAtom<infer N, infer NC1>
    ? AddMap[Carry][N] extends AddAtom<infer N, infer NC2>
        ? AddAtom<N, Safe<AddMap[NC1][NC2]['num'], '0' | '1'>>
        : never
    : `AddNumChar Error: invalid N1(${N1}) or N2(${N2}).`;

type AddCore<
    N1 extends NumChars[],
    N2 extends NumChars[],
    Result extends NumChars[] = [],
    Carry extends NumChars = '0',
> = [N1, N2] extends [[], []]
    ? [Carry, ...Result]
    : N1 extends []
    ? AddCoreCarry<N2, Result, Carry>
    : N2 extends []
    ? AddCoreCarry<N1, Result, Carry>
    : [N1, N2] extends [
          [...infer Rest1 extends NumChars[], infer NC1 extends NumChars],
          [...infer Rest2 extends NumChars[], infer NC2 extends NumChars],
      ]
    ? AddNumChar<NC1, NC2, Carry> extends infer R
        ? R extends AddAtom<infer N, infer C>
            ? AddCore<Rest1, Rest2, [N, ...Result], C>
            : R // error
        : never
    : never;
type AddCoreCarry<
    N extends NumChars[],
    Result extends NumChars[] = [],
    Carry extends NumChars = '0',
> = Carry extends '0'
    ? [...N, ...Result]
    : N extends [...infer Rest extends NumChars[], infer NC extends NumChars]
    ? AddNumChar<NC, Carry> extends infer R
        ? R extends AddAtom<infer N, infer C>
            ? AddCoreCarry<Rest, [N, ...Result], C>
            : R // error
        : never
    : ['1', ...Result];

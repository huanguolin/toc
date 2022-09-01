import { Length, Push } from "./array";
import { EQ } from "./common";

export type ShiftChar<S extends string> =
    S extends `${infer C extends string}${infer R extends string}`
        ? { char: C, rest: R }
        : never;
// type tShiftChar1 = ShiftChar<'1'>;

export type PushChar<S extends string, C extends string> = `${S}${C}`;
// type t = PushChar<ShiftChar<'eff'>, 'a'>

export type StrLength<S extends string, AC extends any[] = []> =
    S extends `${infer C extends string}${infer R extends string}`
        ? StrLength<R, Push<AC, any>>
        : Length<AC>;
type tStrLength = StrLength<'123'>;

export type NumStr = `${number}`;

export type Str2Num<S extends NumStr> = S extends `${infer N extends number}` ? N : never;
// type tStr2Num1 = Str2Num<'13'>;
// type tStr2Num2 = Str2Num<'13d'>;



export type NumChars = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type IsNumberChar<C extends string> = C extends NumChars ? true : false;
// type tIsNumberChar1 = IsNumberChar<'9'>;
// type tIsNumberChar2 = IsNumberChar<'0'>;
// type tIsNumberChar3 = IsNumberChar<never>;


export type IsSpaceChar<C extends string> = EQ<C, '\u0020'>;
// type tIsSpaceChar1 = IsSpaceChar<' '>;
// type tIsSpaceChar2 = IsSpaceChar<''>;
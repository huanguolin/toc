import { Length, Push } from "./array";

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


export type Str2Num<S extends NumStr> = S extends `${infer N extends number}` ? N : never;
// type tStr2Num1 = Str2Num<'13'>;
// type tStr2Num2 = Str2Num<'13d'>;


export type NumStr = `${number}`;
export type NumChars = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type SpaceChars = '\u0020' | '\n';
export type AlphaChars
    = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
    | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
    | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
    | '_';

export type TrimStart<S extends string, Chars extends string | number = SpaceChars> =
    S extends `${infer C extends Chars}${infer R extends string}`
        ? TrimStart<R>
        : S;

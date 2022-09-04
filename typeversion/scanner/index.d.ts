import { Push } from "../utils/array";
import { Safe } from "../utils/common";
import { NumChars, NumStr, PushChar, ShiftChar, TrimStart } from "../utils/string";
import { ScanError, ScanSuccess } from "./ScanResult";
import { BuildToken, EOF } from "./Token";

type Operators =
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '%'
    | '!';

type ScanOperator<S extends string> =
    TrimStart<S> extends `${infer C extends Operators}${infer R extends string}`
        ? ScanSuccess<BuildToken<Safe<C, Operators>, C>, TrimStart<R>>
        : ScanError<'Not match an operator.'>;

type ScanNumber<S extends string, N extends NumStr | '' = ''> =
    TrimStart<S> extends `${infer C extends NumChars}${infer R extends string}`
        ? ScanNumber<R, Safe<PushChar<N, C>, NumStr>>
        : N extends ''
            ? ScanError<'Not match a number.'>
            : ScanSuccess<BuildToken<'number', N>, TrimStart<S>>;

export type Scan<S extends string, A extends any[] = []> =
    S extends ''
        ? Push<A, EOF>
        : ScanNumber<S> extends ScanSuccess<infer T, infer R>
            ? Scan<R, Push<A, T>>
            : ScanOperator<S> extends ScanSuccess<infer T, infer R>
                ? Scan<R, Push<A, T>>
                : ScanError<`Unknown next token: ${ShiftChar<S>['char']}`>;

type tScan = Scan<' !(1-3)'>;

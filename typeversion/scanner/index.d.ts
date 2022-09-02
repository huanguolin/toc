import { Push } from "../utils/array";
import { Safe } from "../utils/common";
import { NumChars, NumStr, PushChar, SpaceChars, ShiftChar } from "../utils/string";
import { ScanError, ScanSuccess } from "./ScanResult";
import { BuildToken, EOF, TokenType } from "./Token";

type Operators = Exclude<TokenType, 'number' | 'EOF'>;

type SkipSpace<S extends string> =
    S extends `${infer C extends SpaceChars}${infer R extends string}`
        ? SkipSpace<R>
        : S;

type ScanOperator<S extends string> =
    SkipSpace<S> extends `${infer C extends Operators}${infer R extends string}`
        ? ScanSuccess<BuildToken<Safe<C, Operators>, C>, SkipSpace<R>>
        : ScanError<'Not match an operator.'>;

type ScanNumber<S extends string, N extends NumStr | '' = ''> =
    SkipSpace<S> extends `${infer C extends NumChars}${infer R extends string}`
        ? ScanNumber<R, Safe<PushChar<N, C>, NumStr>>
        : N extends ''
            ? ScanError<'Not match a number.'>
            : ScanSuccess<BuildToken<'number', N>, SkipSpace<S>>;

export type Scan<S extends string, A extends any[] = []> =
    S extends ''
        ? Push<A, EOF>
        : ScanNumber<S> extends ScanSuccess<infer T, infer R>
            ? Scan<R, Push<A, T>>
            : ScanOperator<S> extends ScanSuccess<infer T, infer R>
                ? Scan<R, Push<A, T>>
                : ScanError<`Unknown next token: ${ShiftChar<S>['char']}`>;

type tScan = Scan<'123 + 15 - 3 / 9 / ( 5 -3)'>;

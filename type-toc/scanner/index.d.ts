import { Push } from "../utils/array";
import { Safe } from "../utils/common";
import { AlphaChars, NumChars, NumStr, PushChar, ShiftChar, SpaceChars } from "../utils/string";
import { ScanError, ScanSuccess } from "./ScanResult";
import { BuildToken, EOF, Token } from "./Token";
import { Keywords, TokenType } from '../type';

export type Scan<S extends string, A extends Token[] = []> =
    S extends ''
        ? Push<A, EOF>
        : S extends `${infer Space extends SpaceChars}${infer Rest}`
            ? Scan<Rest, A>
            : ScanBody<S, A>;

type ScanBody<S extends string, A extends Token[] = []> =
    ScanNumber<S> extends ScanSuccess<infer T, infer R>
        ? Scan<R, Push<A, T>>
        : ScanOperator<S> extends ScanSuccess<infer T, infer R>
            ? Scan<R, Push<A, T>>
            : ScanIdentifier<S> extends ScanSuccess<infer T, infer R>
                ? Scan<R, Push<A, T>>
                : ScanError<`Unknown next token: ${ShiftChar<S>['char']}`>;

type tScan = Scan<'a = b = 8;'>;


type SingleOperators =
    | '{'
    | '}'
    | ';'
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '%'
    | '<'
    | '>'
    | '!'
    | '=';

type IsKeywords<T extends string> = T extends keyof Keywords ? true : false;

type OpGteOrLte<C1 extends '>' | '<', C2 extends '=', R extends string> = `${C1}${C2}${R}`;
type OpEqOrNot<C1 extends '=' | '!', C2 extends '=', R extends string> = `${C1}${C2}${R}`;
type OpAnd<C1 extends '&', C2 extends '&', R extends string> = `${C1}${C2}${R}`;
type OpOr<C1 extends '|', C2 extends '|', R extends string> = `${C1}${C2}${R}`;

type ScanOperator<S extends string> =
    S extends OpGteOrLte<infer C1, infer C2, infer R>
        ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
        : S extends OpEqOrNot<infer C1, infer C2, infer R>
            ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
            : S extends OpAnd<infer C1, infer C2, infer R>
                ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
                : S extends OpOr<infer C1, infer C2, infer R>
                    ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
                    : S extends `${infer C extends SingleOperators}${infer R extends string}`
                        ? ScanSuccess<BuildToken<Safe<C, SingleOperators>, C>, R>
                        : ScanError<'Not match an operator.'>;

type ScanNumber<S extends string, N extends NumStr | '' = ''> =
    S extends `${infer C extends NumChars}${infer R extends string}`
        ? ScanNumber<R, Safe<PushChar<N, C>, NumStr>>
        : N extends ''
            ? ScanError<'Not match a number.'>
            : ScanSuccess<BuildToken<'number', N>, S>;

type AlphaNumChars = NumChars | AlphaChars;
type ScanIdentifier<S extends string> =
    S extends `${infer C extends AlphaChars}${infer R extends string}`
        ? ScanIdentifierBody<R, C>
        : ScanError<'Not match a identifier.'>;
type ScanIdentifierBody<S extends string, I extends string> =
    S extends `${infer C extends AlphaNumChars}${infer R extends string}`
        ? ScanIdentifierBody<R, PushChar<I, C>>
        : IsKeywords<I> extends true
            ? ScanSuccess<BuildToken<Safe<I, TokenType>, I>, S>
            : ScanSuccess<BuildToken<'identifier', I>, S>;

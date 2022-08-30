import { Length, Push } from "./array";

export type ShiftChar<S extends string> =
    S extends `${infer C extends string}${infer T extends string}`
        ? C
        : never;

export type DropChar<S extends string> =
    S extends `${infer C extends string}${infer T extends string}`
        ? T
        : '';
type tDropChar1 = DropChar<'123'>;
type tDropChar2 = DropChar<''>;

export type PushChar<S extends string, C extends string> = `${S}${C}`;
type t = PushChar<ShiftChar<'effg'>, 'a'>

export type StrLength<S extends string, AC extends any[] = []> =
    S extends ''
        ? Length<AC>
        : StrLength<DropChar<S>, Push<AC, any>>;
type tStrLength = StrLength<'123'>;

export type Str2Num<S extends string> = S extends `${infer N extends number}` ? N : never;
type tStr2Num = Str2Num<'13d'>;
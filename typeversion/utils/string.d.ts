export type ShiftChar<S extends string> =
    S extends `${infer C extends string}${infer T extends string}`
        ? C
        : never;

export type PushChar<S extends string, C extends string> = `${S}${C}`;

type t = PushChar<ShiftChar<'effg'>, 'a'>
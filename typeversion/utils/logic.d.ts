import { TrimStart } from "./string";

export type IsFalse<T> =
    T extends false | null | undefined | 0 | ''
        ? true
        : T extends string
            ? TrimStart<T> extends ''
                ? true
                : false
            : false;
type tIsFalse1 = IsFalse<0>;
type tIsFalse2 = IsFalse<''>;
type tIsFalse3 = IsFalse<null>;
type tIsFalse4 = IsFalse<undefined>;
type tIsFalse5 = IsFalse<'  '>;
type tIsFalse6 = IsFalse<' 0 '>;
type tIsFalse7 = IsFalse<false>;

export type Inverse<T> = IsFalse<T>;
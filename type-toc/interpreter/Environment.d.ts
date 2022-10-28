import { NoWay } from "../Result";
import { ValueType } from "../type";

import { RuntimeError } from "./RuntimeError";
import { TocMap, MapHas, MapSet, MapGet } from "./map";


export interface Environment {
    store: TocMap;
    outer: Environment | null;
}

export interface BuildEnv<
    Initializer extends TocMap = {},
    Outer extends Environment | null = null,
> extends Environment {
    store: Initializer;
    outer: Outer;
}

export type EnvDefine<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends TocMap = Env['store']
> = MapHas<Store, Key> extends true
    ? RuntimeError<`Variable '${Key}' already defined.`>
    : BuildEnv<MapSet<Store, Key, Value>, Env['outer']>;

export type EnvGet<
    Env extends Environment,
    Key extends string,
    Store extends TocMap = Env['store'],
    Outer = Env['outer'],
> = MapHas<Store, Key> extends true
    ? MapGet<Store, Key>
    : Outer extends Environment
        ? EnvGet<Outer, Key>
        : RuntimeError<`Undefined variable '${Key}'.`>;

export type EnvAssign<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends TocMap = Env['store'],
    Outer extends Environment | null = Env['outer'],
> = MapHas<Store, Key> extends true
    ? BuildEnv<MapSet<Store, Key, Value>, Outer>
    : Outer extends Environment
        ? EnvAssign<Outer, Key, Value> extends infer NewOuter
            ? NewOuter extends Environment
                ? BuildEnv<Store, NewOuter>
                : NewOuter // error
            : NoWay<'EnvAssign'>
        : RuntimeError<`Undefined variable '${Key}'.`>;


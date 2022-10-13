import { NoWay } from "../Result";
import { ValueType } from "../type";

import { RuntimeError } from "./RuntimeError";

export type Environment = {
    store: { [Key: string]: ValueType };
    outer: Environment | null;
};

export type BuildEnv<
    Initializer extends EnvMap = {},
    Outer extends Environment | null = null,
> = {
    store: Initializer;
    outer: Outer;
};

export type EnvDefine<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends EnvMap = Env['store']
> = Has<Store, Key> extends true
    ? RuntimeError<`Variable '${Key}' already defined.`>
    : BuildEnv<Set<Store, Key, Value>, Env['outer']>;

export type EnvGet<
    Env extends Environment,
    Key extends string,
    Store extends EnvMap = Env['store'],
    Outer = Env['outer'],
> = Has<Store, Key> extends true
    ? Get<Store, Key>
    : Outer extends Environment
        ? EnvGet<Outer, Key>
        : RuntimeError<`Undefined variable '${Key}'.`>;

export type EnvAssign<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends EnvMap = Env['store'],
    Outer extends Environment | null = Env['outer'],
> = Has<Store, Key> extends true
    ? BuildEnv<Set<Store, Key, Value>, Outer>
    : Outer extends Environment
        ? EnvAssign<Outer, Key, Value> extends infer NewOuter
            ? NewOuter extends Environment
                ? BuildEnv<Store, NewOuter>
                : NewOuter // error
            : NoWay<'EnvAssign'>
        : RuntimeError<`Undefined variable '${Key}'.`>;

type EnvMap = { [key: string]: ValueType };

// eslint-disable-next-line no-redeclare
type Set<
    M extends EnvMap,
    K extends string,
    V extends ValueType,
> = Omit<M, K> & { [Key in K]: V };
type tSet = Set<{ a: 5 }, 'a', false>['a'];

type Get<
    M extends EnvMap,
    K extends string,
> = M[K];
type tGet = Get<{ a: null }, 'b'>;

type Has<
    M extends EnvMap,
    K extends string,
> = K extends keyof M ? true : false;
type tHas = Has<{ a: 9, b: false, c: null}, 'd'>;
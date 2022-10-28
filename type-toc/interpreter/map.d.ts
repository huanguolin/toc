import { ValueType } from "../type";

// 为了避免和 js 原生的 Map 重名，取名为 TocMap
export type TocMap = { [key: string]: ValueType };

export type MapSet<
    M extends TocMap,
    K extends string,
    V extends ValueType,
> = Omit<M, K> & { [Key in K]: V };
type tSet = MapSet<{ a: 5 }, 'a', false>['a'];

export type MapGet<
    M extends TocMap,
    K extends string,
> = M[K];
type tGet = MapGet<{ a: null }, 'b'>;

export type MapHas<
    M extends TocMap,
    K extends string,
> = K extends keyof M ? true : false;
type tHas = MapHas<{ a: 9, b: false, c: null}, 'a'>;
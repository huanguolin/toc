import { Environment } from "./interpreter/Environment";
import { FunStmt } from "./parser/Stmt";
import { Token } from "./scanner/Token";

export type FunObject = {
    declaration: FunStmt;
    environment: Environment;
};

export type BuildFunObj<
    D extends FunStmt,
    E extends Environment,
> = {
    declaration: D,
    environment: E,
};

export type FunObjToString<
    F extends FunObject,
    D extends FunStmt = F['declaration']
> = `<fun ${GetFunName<F>}(${ParamsToString<D['parameters']>})>`;

export type GetFunName<F extends FunObject> = F['declaration']['name']['lexeme'];

type ParamsToString<
    Params extends Token[],
    Result extends string = '',
> = Params extends [infer T extends Token, ...infer R extends Token[]]
    ? ParamsToString<R, Combine<Result, T['lexeme']>>
    : Result;
type Combine<
    A extends string,
    B extends string,
> = A extends ''
    ? B
    : `${A}, ${B}`;
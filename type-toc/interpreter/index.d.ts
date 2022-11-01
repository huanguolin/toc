import { NoWay } from '../Result';
import { Stmt } from '../parser/Stmt';
import { ValueType } from '../type';

import { BuildEnv, Environment } from './Environment';
import { InterpretStmt, InterpretStmtSuccess } from './InterpretStmt';

export type Interpret<
    Stmts extends Stmt[],
    Env extends Environment = BuildEnv<{}, null>,
    LastResult extends ValueType | null = null,
> = Stmts extends [infer S extends Stmt, ...infer Rest extends Stmt[]]
    ? InterpretStmt<S, Env> extends infer R
        ? R extends InterpretStmtSuccess<infer Result, infer Env>
            ? Interpret<Rest, Env, Result>
            : R // error
        : NoWay<'Interpret'>
    : LastResult;

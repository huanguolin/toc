import { Expr } from "../parser/Expr";
import { BlockStmt, ExprStmt, FunStmt, IfStmt, Stmt, VarStmt } from "../parser/Stmt";
import { ErrorResult, NoWay, SuccessResult } from "../Result"
import { ValueType } from "../type";
import { IsTrue } from "../utils/logic";
import { BuildEnv, EnvDefine, Environment } from "./Environment";
import { InterpretExpr, InterpretExprSuccess } from "./InterpretExpr";
import { BuildFunObj, FunObject } from '../FunObject';

export type InterpretStmtError<M extends string> = ErrorResult<`[InterpretStmtError]: ${M}`>;
export type InterpretStmtSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;

export type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], Env>
                : S extends IfStmt
                    ? InterpretIfStmt<S, Env>
                    : S extends FunStmt
                        ? InterpretFunStmt<S, Env>
                        : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretFunStmt<
    S extends FunStmt,
    Env extends Environment,
    F extends FunObject = BuildFunObj<S, Env>,
> = EnvDefine<Env, S['name']['lexeme'], F> extends infer NewEnv
    ? NewEnv extends Environment
        ? InterpretStmtSuccess<F, NewEnv>
        : NewEnv // error
    : NoWay<'InterpretFunStmt'>;

type InterpretIfStmt<
    S extends IfStmt,
    Env extends Environment,
> = InterpretExpr<S['condition'], Env> extends infer CR
    ? CR extends InterpretExprSuccess<infer C, infer Env>
        ? IsTrue<C> extends true
            ? InterpretStmt<S['ifClause'], Env>
            : S['elseClause'] extends Stmt
                ? InterpretStmt<S['elseClause'], Env>
                : InterpretStmtSuccess<null, Env>
        : CR // error
    : NoWay<'InterpretIfStmt'>;

type InterpretBlockStmt<
    Stmts extends Stmt[],
    Env extends Environment,
    NewEnv extends Environment = BuildEnv<{}, Env>,
    LastResult extends ValueType = null
> = Stmts extends [infer S1 extends Stmt, ...infer Rest extends Stmt[]]
    ? InterpretBlockStmtBody<InterpretStmt<S1, NewEnv>, Rest, Env>
    : InterpretStmtSuccess<LastResult, Env>;
type InterpretBlockStmtBody<
    RV,
    Rest extends Stmt[],
    Env extends Environment
> = 
    RV extends InterpretStmtSuccess<infer V, infer NewEnv>
        ? InterpretBlockStmt<Rest, Env, NewEnv, V>
        : RV; // error

type InterpretVarStmt<
    S extends VarStmt,
    Env extends Environment,
    Initializer = S['initializer']
> = Initializer extends Expr
    ? InterpretExpr<Initializer, Env> extends infer EV
        ? EV extends InterpretExprSuccess<infer V, infer Env>
            ? WrapVarStmtResult<V, EnvDefine<Env, S['name']['lexeme'], V>>
            : EV // error
        : NoWay<'InterpretVarStmt'>
    : WrapVarStmtResult<null, EnvDefine<Env, S['name']['lexeme'], null>>;
type WrapVarStmtResult<V extends ValueType, Env> = Env extends Environment
    ? InterpretStmtSuccess<V, Env>
    : Env; // error

type InterpretExprStmt<
    S extends ExprStmt,
    Env extends Environment,
    R = InterpretExpr<S['expression'], Env>
> =
    R extends InterpretExprSuccess<infer V, infer Env>
        ? InterpretStmtSuccess<V, Env>
        : R; // error

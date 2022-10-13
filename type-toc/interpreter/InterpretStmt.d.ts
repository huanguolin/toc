import { BuildFunObj, FunObject } from '../FunObject';
import { ErrorResult, NoWay, SuccessResult } from "../Result";
import { Expr } from "../parser/Expr";
import { BlockStmt, ExprStmt, ForStmt, FunStmt, IfStmt, Stmt, VarStmt } from "../parser/Stmt";
import { ValueType } from "../type";
import { Safe } from "../utils/common";
import { IsTrue } from "../utils/logic";

import { BuildEnv, EnvDefine, Environment } from "./Environment";
import { InterpretExpr, InterpretExprSuccess } from "./InterpretExpr";

export type InterpretStmtError<M extends string> = ErrorResult<`[InterpretStmtError]: ${M}`>;
export type InterpretStmtSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;

export type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], BuildEnv<{}, Env>>
                : S extends IfStmt
                    ? InterpretIfStmt<S, Env>
                    : S extends FunStmt
                        ? InterpretFunStmt<S, Env>
                        : S extends ForStmt
                            ? InterpretForStmt<S, BuildEnv<{}, Env>>
                            : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretForStmt<
    S extends ForStmt,
    NewEnv extends Environment,
> = S['initializer'] extends Stmt
    ? InterpretStmt<S['initializer'], NewEnv> extends infer IR
        ? IR extends InterpretStmtSuccess<infer IV, infer NewEnv>
            ? InterpretForStmtFromCondition<S, NewEnv>
            : IR // error
        : NoWay<'InterpretForStmt'>
    : InterpretForStmtFromCondition<S, NewEnv>;
type InterpretForStmtFromCondition<
    S extends ForStmt,
    NewEnv extends Environment,
    BV extends ValueType = null,
> = S['condition'] extends Expr
    ? InterpretExpr<S['condition'], NewEnv> extends infer CR
        ? CR extends InterpretExprSuccess<infer CV, infer NewEnv>
            ? InterpretForStmtFromConditionValue<S, NewEnv, CV, BV>
            : CR // error
        : NoWay<'InterpretForStmtFromCondition-InterpretExpr'>
    : InterpretForStmtFromConditionValue<S, NewEnv, true, BV>;
type InterpretForStmtFromConditionValue<
    S extends ForStmt,
    NewEnv extends Environment,
    CV extends ValueType,
    BV extends ValueType = null,
> = IsTrue<CV> extends true
    ?  InterpretStmt<S['body'], NewEnv> extends infer BR
        ? BR extends InterpretStmtSuccess<infer BV, infer NewEnv>
            ? S['increment'] extends Expr
                ? InterpretExpr<S['increment'], NewEnv> extends infer IR
                    ? IR extends InterpretExprSuccess<infer IV, infer NewEnv>
                        ? InterpretForStmtFromCondition<S, NewEnv, BV>
                        : IR // error
                    : NoWay<'InterpretForStmtFromConditionValue-Increment'>
                : InterpretForStmtFromCondition<S, NewEnv, BV>
            : BR // error
        : NoWay<'InterpretForStmtFromConditionValue-Body'>
    : InterpretStmtSuccess<BV, Safe<NewEnv['outer'], Environment>>;


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
    NewEnv extends Environment,
    LastResult extends ValueType = null
> = Stmts extends [infer S1 extends Stmt, ...infer Rest extends Stmt[]]
    ? InterpretBlockStmtBody<InterpretStmt<S1, NewEnv>, Rest>
    : InterpretStmtSuccess<LastResult, Safe<NewEnv['outer'], Environment>>;
type InterpretBlockStmtBody<
    RV,
    Rest extends Stmt[],
> =
    RV extends InterpretStmtSuccess<infer V, infer NewEnv>
        ? InterpretBlockStmt<Rest, NewEnv, V>
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

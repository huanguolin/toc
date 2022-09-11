import { Expr } from "../parser/Expr";
import { ExprStmt, Stmt, VarStmt } from "../parser/Stmt";
import { ErrorResult, SuccessResult } from "../Result"
import { ValueType } from "../type";
import { EnvDefine, Environment } from "./Environment";
import { InterpretExpr, InterpretExprSuccess } from "./InterpretExpr";
import { RuntimeError } from "./RuntimeError";

export type InterpretStmtError<M extends string> = ErrorResult<`[InterpretStmtError]: ${M}`>;
export type InterpretStmtSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;

export type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretVarStmt<
    S extends VarStmt,
    Env extends Environment,
    Initializer = S['initializer']
> = Initializer extends Expr
    ? InterpretExpr<Initializer, Env> extends infer EV
        ? EV extends InterpretExprSuccess<infer V, infer Env>
            ? WrapVarStmtResult<V, EnvDefine<Env, S['name']['lexeme'], V>>
            : EV // error
        : '[InterpretVarStmt] impossible here!'
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

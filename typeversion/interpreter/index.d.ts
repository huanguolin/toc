import { Stmt } from "../parser/Stmt";
import { InterpretStmt, InterpretStmtSuccess } from "./InterpretStmt";

export type Interpret<Stmts extends Stmt[], LastResult = null> =
    Stmts extends [infer S extends Stmt, ...infer Rest extends Stmt[]]
        ? InterpretStmt<S> extends infer R
            ? R extends InterpretStmtSuccess<infer Result>
                ? Interpret<Rest, Result>
                : R // error
            : '[Interpret] impossible here!'
        : LastResult;
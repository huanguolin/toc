import { Expr } from "../parser/Expr";

import { InterpretExpr, InterpretExprSuccess } from "./InterpretExpr";

export type Interpret<E extends Expr, R = InterpretExpr<E>> =
    R extends InterpretExprSuccess<infer V>
        ? V
        : R; // error
import { Token } from "../scanner/Token";

import { ParseExpr, ParseExprSuccess } from "./ParseExprHelper";

export type Parse<Tokens extends Token[], R = ParseExpr<Tokens>> =
    R extends ParseExprSuccess<infer E, infer Rest>
        ? E
        : R; // error

import { NoWay } from "../Result";
import { Token } from "../scanner/Token";
import { EOF } from "../scanner/Token";
import { Push } from "../utils/array";

import { ParseStmt, ParseStmtSuccess } from "./ParseStmtHelper";
import { Stmt } from "./Stmt";

export type Parse<Tokens extends Token[], Stmts extends Stmt[] = []> =
    Tokens extends [EOF]
        ? Stmts
        : ParseStmt<Tokens> extends infer Result
            ? Result extends ParseStmtSuccess<infer R, infer Rest>
                ? Parse<Rest, Push<Stmts, R>>
                : Result // error
            : NoWay<'Parse'>;

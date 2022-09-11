import { Token } from "../scanner/Token";
import { EOF } from "../scanner/Token";
import { ParseStmt, ParseStmtError, ParseStmtSuccess } from "./ParseStmtHelper";
import { Stmt } from "./Stmt";
import { Push } from "../utils/array";

export type Parse<Tokens extends Token[], Stmts extends Stmt[] = []> =
    Tokens extends [infer E extends EOF]
        ? Stmts
        : ParseStmt<Tokens> extends infer Result
            ? Result extends ParseStmtSuccess<infer R, infer Rest>
                ? Parse<Rest, Push<Stmts, R>>
                : Result // error
            : ParseStmtError<'Impossible here.'>;

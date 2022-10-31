import { NoWay } from "./Result";
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Expr } from "./parser/Expr";
import { Scan } from "./scanner";
import { Token } from "./scanner/Token";

/**
 * Change Toc's input, and hover "Result" to see the result. 😀
 * 👇👇👇
 */
type Result = Toc<`22 + 20 * 100 - 3`>

export type Toc<Source extends string> =
    Scan<Source> extends infer Tokens
        ? Tokens extends Token[]
            ? Parse<Tokens> extends infer E
                ? E extends Expr
                    ? Interpret<E>
                    : E // error
                : NoWay<'Toc-Parse'>
            : Tokens // error
        : NoWay<'Toc-Scan'>;

/**
 * debug
 */
type Input = `10 - 2 * 3`;
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
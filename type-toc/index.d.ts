import { FunObject, FunObjToString } from "./FunObject";
import { NoWay } from "./Result";
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Stmt } from "./parser/Stmt";
import { Scan } from "./scanner";
import { Token } from "./scanner/Token";

/**
 * Change Toc's input, and hover "Result" to see the result. 😀
 * 👇👇👇
 */
type Result = Toc<`
    fun genInc(x) {
        fun inc(y) {
            x + y;
        }
    }

    var inc3 = genInc(3);
    inc3(22 + 20 * 100 - 3);
`>

export type Toc<Source extends string> =
    Scan<Source> extends infer Tokens
        ? Tokens extends Token[]
            ? Parse<Tokens> extends infer Stmts
                ? Stmts extends Stmt[]
                    ? Interpret<Stmts> extends infer Value
                        ? Value extends FunObject
                            ? FunObjToString<Value>
                            : Value
                        : NoWay<'Toc-Interprets'>
                    : Stmts // error
                : NoWay<'Toc-Parse'>
            : Tokens // error
        : NoWay<'Toc-Scan'>;

/**
 * debug
 */
type Input = `
var x = 1006;
var i = 1;
for (; i < 4; i=i+1)
    x = x + i;
`;
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
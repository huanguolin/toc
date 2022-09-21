import { FunObject, FunObjToString } from "./FunObject";
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Stmt } from "./parser/Stmt";
import { NoWay } from "./Result";
import { Scan } from "./scanner";
import { Token } from "./scanner/Token";

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

type Result = Toc<'fun a(i) {i+1;} a(2);'>;

/**
 * debug
 */
// type Input = ' 123 % 100 + 15 - 12 / 3 / ( 5 -3);';
// type Input = '(5 -3 ) * 6 || 7 - ( 9 / 3 );';
type Input = `
var x = 0;
for (var i = 1; i < 5; i=i+1)
    x = x + i;
`;
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Stmt } from "./parser/Stmt";
import { Scan } from "./scanner";
import { Token } from "./scanner/Token";

type NoWay = '[Toc] impossible here!';

export type Toc<Source extends string> =
    Scan<Source> extends infer Tokens
        ? Tokens extends Token[]
            ? Parse<Tokens> extends infer Stmts
                ? Stmts extends Stmt[]
                    ? Interpret<Stmts>
                    : Stmts // error
                : NoWay
            : Tokens // error
        : NoWay;

type Result = Toc<'var a = 8; !(10 + a / 3 - 999);'>;


/**
 * debug
 */
// type Input = ' 123 % 100 + 15 - 12 / 3 / ( 5 -3);';
// type Input = '(5 -3 ) * 6 || 7 - ( 9 / 3 );';
type Input = `
var b = 4;
{
    var a= b = 3;
	b = 99;
}
var c = b + 12;
`;
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
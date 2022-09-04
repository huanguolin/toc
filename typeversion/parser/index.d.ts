import { Token } from "../scanner/Token";
import { BuildBinary, BuildGroup, BuildLiteral, BuildUnary, Expr, GroupExpr } from "./Expr";
import { ParseError, ParseSuccess } from "./ParseResult";
import { EOF } from "../scanner/Token";

export type Parse<Tokens extends Token[], Temp = ParseExpr<Tokens>> =
    Tokens extends [infer E extends EOF]
        ? BuildLiteral<0>
        : Temp extends ParseSuccess<infer Result, infer Rest extends [EOF]>
            ? Result
            : Temp;

// 表达式分类并按照由低到高：
// term:    + -         左结合
// factor:  * /         左结合
// unary:   !           右结合
// primary: number ()
type TermOpToken = Token & { type: '+' | '-' };
type FactorOpToken = Token & { type: '*' | '/' | '%' };
type UnaryOpToken = Token & { type: '!' };

type ParseExpr<Tokens extends Token[]> = ParseTerm<Tokens>;

// term part
type ParseTerm<Tokens extends Token[], R = ParseFactor<Tokens>> =
    R extends ParseSuccess<infer Left, infer Rest>
        ? ParseTermBody<Left, Rest>
        : ParseError<'Parse term fail.'>;
type ParseTermBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends [infer Op extends TermOpToken, ...infer Rest1 extends Token[]]
        ? ParseFactor<Rest1> extends ParseSuccess<infer Right, infer Rest2>
            ? ParseTermBody<BuildBinary<Left, Op, Right>, Rest2>
            : ParseError<`Parse term of right fail: ${Rest1[0]['lexeme']}`>
        : ParseSuccess<Left, Tokens>;

// factor part
type ParseFactor<Tokens extends Token[], R = ParseUnary<Tokens>> =
    R extends ParseSuccess<infer Left, infer Rest>
        ? ParseFactorBody<Left, Rest>
        : ParseError<'Parse factor fail.'>;
type ParseFactorBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends [infer Op extends FactorOpToken, ...infer Rest1 extends Token[]]
        ? ParseUnary<Rest1> extends ParseSuccess<infer Right, infer Rest2>
            ? ParseFactorBody<BuildBinary<Left, Op, Right>, Rest2>
            : ParseError<`Parse factor of right fail: ${Rest1[0]['lexeme']}`>
        : ParseSuccess<Left, Tokens>;


// unary part
type ParseUnary<Tokens extends Token[]> =
    Tokens extends [infer Op extends UnaryOpToken, ...infer Rest1 extends Token[]]
        ? ParseUnary<Rest1> extends ParseSuccess<infer Expr, infer Rest2>
            ? ParseSuccess<BuildUnary<Op, Expr>, Rest2>
            : ParseError<`ParseUnary error after ${Op["lexeme"]}`>
        : ParsePrimary<Tokens>;

// primary part
type ParsePrimary<Tokens extends Token[]> =
    Tokens extends [infer E extends Token, ...infer R extends Token[]]
        ? E extends { type: 'number', value: infer V extends number }
            ? ParseSuccess<BuildLiteral<V>, R>
            : E extends { type: '(' }
                ? ParseExpr<R> extends ParseSuccess<infer G, infer RG>
                    ? RG extends [infer EP extends { type: ')' }, ...infer Rest extends Token[]]
                        ? ParseSuccess<BuildGroup<G>, Rest>
                        : ParseError<`Group not match ')'.`>
                    : ParseError<`Parse Group expression fail.`>
            : ParseError<`Unknown token type: ${E['type']}, lexeme: ${E['lexeme']}`>
        : ParseError<`ParsePrimary fail`>;

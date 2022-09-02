import { Token } from "../scanner/Token";
import { Length } from "../utils/array";
import { BuildBinary, BuildGroup, BuildLiteral, Expr } from "./Expr";
import { ParseError, ParseResult, ParseSuccess } from "./ParseResult";
import { EOF } from "../scanner/Token";

export type Parse<T extends Token[]> =
    T extends [infer E extends EOF]
        ? BuildLiteral<0>
        : ParseExpr<T>;

// 表达式优先级由低到高：
// + -
// * /
// number ()
type TermOpToken = Token & { type: '+' | '-' };
type FactorOpToken = Token & { type: '*' | '/' };
type NumberToken = Token & { type: 'number' };
type GroupOpToken = Token & { type: '(' | ')' };

type ParseExpr<T extends Token[]> = ParseTerm<T>;

// term part
type ParseTerm<T extends Token[], R = ParsePrimary<T>> =
    R extends ParseSuccess<infer Left, infer Rest>
        ? ParseTermBody<Left, Rest>
        : ParseError<'Parse term fail.'>;
type ParseTermBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends [infer Op extends TermOpToken, ...infer Rest1 extends Token[]]
        ? ParsePrimary<Rest1> extends ParseSuccess<infer Right, infer Rest2>
            ? ParseTermBody<BuildBinary<Left, Op, Right>, Rest2>
            : ParseError<`Parse term of right fail: ${Rest1[0]['lexeme']}`>
        : Left;

// primary
type ParsePrimary<T extends Token[]> =
    T extends [infer L extends Token, ...infer R extends Token[]]
        ? L extends { type: 'number', value: infer V extends number }
            ? ParseSuccess<BuildLiteral<V>, R>
            : ParseError<`Unknown token type: ${L['type']}, lexeme: ${L['lexeme']}`>
        : ParseError<`ParsePrimary fail`>;

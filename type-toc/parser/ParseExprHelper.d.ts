import { ErrorResult, SuccessResult } from '../Result';
import { Token } from '../scanner/Token';
import { Keywords, ValueType } from '../type';
import { Safe } from '../utils/common';
import { Expr, BuildBinaryExpr, BuildUnaryExpr, BuildLiteralExpr, BuildGroupExpr, BuildVariableExpr, VariableExpr, BuildAssignExpr } from "./Expr";
import { Match, TokenLike } from './utils';

export type ParseExprError<M extends string> = ErrorResult<`[ParseExprError]: ${M}`>;
export type ParseExprSuccess<R extends Expr, T extends Token[]> = SuccessResult<{ expr: R, rest: T }>;

export type ParseExpr<Tokens extends Token[]> = ParseAssign<Tokens>;

// 表达式分类并按照由低到高：
// assign:      =           右结合
// logic or:    ||          左结合
// logic and:   &&          左结合
// equality:    == !=       左结合
// relation:    < > <= >=   左结合
// term:        + -         左结合
// factor:      * /         左结合
// unary:       !           右结合
// primary:     number ()
type LogicOrOpToken = Token & { type: '||' };
type LogicAndOpToken = Token & { type: '&&' };
type EqualityOpToken = Token & { type: '==' | '!=' };
type RelationOpToken = Token & { type: '<' | '>' | '<=' | '>=' };
type TermOpToken = Token & { type: '+' | '-' };
type FactorOpToken = Token & { type: '*' | '/' | '%' };
type UnaryOpToken = Token & { type: '!' };

// assign part
type ParseAssign<Tokens extends Token[], R = ParseLogicOr<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseAssignBody<Left, Rest>
        : R; // error
type ParseAssignBody<Left extends Expr, Tokens extends Token[]> =
Tokens extends Match<TokenLike<'='>, infer Rest1>
    ? ParseAssign<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
        ? Left extends VariableExpr
            ? ParseExprSuccess<BuildAssignExpr<Left['name'], Right>, Rest2>
            : ParseExprError<`Invalid assignment target: ${Left['type']}}`>
        : ParseExprError<`Parse right of assign variable fail: ${Rest1[0]['lexeme']}`>
    : ParseExprSuccess<Left, Tokens>;

// logic or part
type ParseLogicOr<Tokens extends Token[], R = ParseLogicAnd<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicOrBody<Left, Rest>
        : R;
type ParseLogicOrBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'||'>, infer Rest1>
        ? ParseLogicAnd<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseLogicOrBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse logic *or* of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// logic and part
type ParseLogicAnd<Tokens extends Token[], R = ParseEquality<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicAndBody<Left, Rest>
        : R;
type ParseLogicAndBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'&&'>, infer Rest1>
        ? ParseEquality<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseLogicAndBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse logic *and* of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// equality part
type ParseEquality<Tokens extends Token[], R = ParseRelation<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseEqualityBody<Left, Rest>
        : R;
type ParseEqualityBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'==' | '!='>, infer Rest1>
        ? ParseRelation<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseEqualityBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse equality of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// relation part
type ParseRelation<Tokens extends Token[], R = ParseTerm<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseRelationBody<Left, Rest>
        : R;
type ParseRelationBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'>' | '<' | '>=' | '<='>, infer Rest1>
        ? ParseTerm<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseRelationBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse relation of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// term part
type ParseTerm<Tokens extends Token[], R = ParseFactor<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseTermBody<Left, Rest>
        : R;
type ParseTermBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'+' | '-'>, infer Rest1>
        ? ParseFactor<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseTermBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse term of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// factor part
type ParseFactor<Tokens extends Token[], R = ParseUnary<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseFactorBody<Left, Rest>
        : R;
type ParseFactorBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'*' | '/' | '%'>, infer Rest1>
        ? ParseUnary<Rest1> extends ParseExprSuccess<infer Right, infer Rest2>
            ? ParseFactorBody<BuildBinaryExpr<Left, Op, Right>, Rest2>
            : ParseExprError<`Parse factor of right fail: ${Rest1[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;


// unary part
type ParseUnary<Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'!'>, infer Rest1>
        ? ParseUnary<Rest1> extends ParseExprSuccess<infer Expr, infer Rest2>
            ? ParseExprSuccess<BuildUnaryExpr<Op, Expr>, Rest2>
            : ParseExprError<`ParseUnary error after ${Op["lexeme"]}`>
        : ParsePrimary<Tokens>;

// primary part
type ParsePrimary<Tokens extends Token[]> =
    Tokens extends Match<infer E extends Token, infer R>
        ? E extends { type: 'number', value: infer V extends number }
            ? ParseExprSuccess<BuildLiteralExpr<V>, R>
            : E extends { type: infer B extends keyof Keywords }
                ? ParseExprSuccess<BuildLiteralExpr<ToValue<B>>, R>
                : E extends TokenLike<{ type: 'identifier' }>
                    ? ParseExprSuccess<BuildVariableExpr<E>, R>
                    : E extends TokenLike<'('>
                        ? ParseExpr<R> extends ParseExprSuccess<infer G, infer RG>
                            ? RG extends Match<TokenLike<')'>, infer Rest>
                                ? ParseExprSuccess<BuildGroupExpr<G>, Rest>
                                : ParseExprError<`Group not match ')'.`>
                            : ParseExprError<`Parse Group expression fail.`>
                        : ParseExprError<`Unknown token type: ${E['type']}, lexeme: ${E['lexeme']}`>
        : ParseExprError<`ParsePrimary fail`>;

type ToValue<K extends keyof Keywords> = Safe<KeywordValueMapping[Safe<K, keyof KeywordValueMapping>], ValueType>;

type KeywordValueMapping = {
    true: true;
    false: false;
    null: null;
};
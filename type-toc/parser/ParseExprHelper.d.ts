import { ErrorResult, SuccessResult } from '../Result';
import { Token } from '../scanner/Token';
import { Keywords, ValueType } from '../type';
import { Safe } from '../utils/common';

import { Expr, BuildBinaryExpr, BuildUnaryExpr, BuildLiteralExpr, BuildGroupExpr } from "./Expr";
import { Match, TokenLike } from './utils';

export type ParseExprError<M extends string> = ErrorResult<`[ParseExprError]: ${M}`>;
export type ParseExprSuccess<R extends Expr, T extends Token[]> = SuccessResult<{ expr: R, rest: T }>;

export type ParseExpr<Tokens extends Token[]> = ParseLogicOr<Tokens>;

// 优先级、结合性参考 C 语言：https://www.tutorialspoint.com/cprogramming/c_operators_precedence.htm
// 表达式分类并按照由低到高：
// logic or:    ||                  左结合
// logic and:   &&                  左结合
// equality:    == !=               左结合
// relation:    < > <= >=           左结合
// additive:    + -                 左结合
// factor:      * / %               左结合
// unary:       !                   右结合
// primary:     literal group

// logic or part
type ParseLogicOr<Tokens extends Token[], R = ParseLogicAnd<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicOrBody<Left, Rest>
        : R;
type ParseLogicOrBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'||'>, infer Rest>
        ? ParseLogicAnd<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseLogicOrBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse logic *or* of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// logic and part
type ParseLogicAnd<Tokens extends Token[], R = ParseEquality<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicAndBody<Left, Rest>
        : R;
type ParseLogicAndBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'&&'>, infer Rest>
        ? ParseEquality<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseLogicAndBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse logic *and* of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// equality part
type ParseEquality<Tokens extends Token[], R = ParseRelation<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseEqualityBody<Left, Rest>
        : R;
type ParseEqualityBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'==' | '!='>, infer Rest>
        ? ParseRelation<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseEqualityBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse equality of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// relation part
type ParseRelation<Tokens extends Token[], R = ParseAdditive<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseRelationBody<Left, Rest>
        : R;
type ParseRelationBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'>' | '<' | '>=' | '<='>, infer Rest>
        ? ParseAdditive<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseRelationBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse relation of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// additive part
type ParseAdditive<Tokens extends Token[], R = ParseFactor<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseAdditiveBody<Left, Rest>
        : R;
type ParseAdditiveBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'+' | '-'>, infer Rest>
        ? ParseFactor<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseAdditiveBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse additive of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;

// factor part
type ParseFactor<Tokens extends Token[], R = ParseUnary<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseFactorBody<Left, Rest>
        : R;
type ParseFactorBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'*' | '/' | '%'>, infer Rest>
        ? ParseUnary<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseFactorBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse factor of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;


// unary part
type ParseUnary<Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'!'>, infer Rest>
        ? ParseUnary<Rest> extends ParseExprSuccess<infer Expr, infer Rest>
            ? ParseExprSuccess<BuildUnaryExpr<Op, Expr>, Rest>
            : ParseExprError<`ParseUnary error after ${Op["lexeme"]}`>
        : ParsePrimary<Tokens>;


// primary part
type ParsePrimary<Tokens extends Token[]> =
    Tokens extends Match<infer E extends Token, infer R>
        ? E extends { type: 'number', value: infer V extends number }
            ? ParseExprSuccess<BuildLiteralExpr<V>, R>
            : E extends { type: 'string', lexeme: infer V extends string }
                ? ParseExprSuccess<BuildLiteralExpr<V>, R>
                : E extends { type: infer B extends keyof Keywords }
                    ? ParseExprSuccess<BuildLiteralExpr<ToValue<B>>, R>
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
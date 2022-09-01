import { EQ } from "../utils/common";
import { Str2Num } from "../utils/string";

export type TokenType = 'number' | '(' | ')' | '+' | '-' | '/' | '*' | 'EOF';

export type Token = {
    type: TokenType,
    lexeme: string,
    value: number | null,
};

export type BuildToken<
    Type extends TokenType,
    Lexeme extends string,
> = {
    type: Type,
    lexeme: Lexeme,
    value: EQ<Type, 'number'> extends true ? Str2Num<Lexeme> : null,
};

export type EOF = BuildToken<'EOF', ''>;
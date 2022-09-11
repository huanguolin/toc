import { TokenType } from "../type";
import { EQ, Safe } from "../utils/common";
import { NumStr, Str2Num } from "../utils/string";

export type Token = {
    type: TokenType,
    lexeme: string,
    value: number | null,
};

export type TokenLike<T extends Partial<Token>> = Token & T;

export type BuildToken<
    Type extends TokenType,
    Lexeme extends string,
> = {
    type: Type,
    lexeme: Lexeme,
    value: EQ<Type, 'number'> extends true ? Str2Num<Safe<Lexeme, NumStr>> : null,
};

export type EOF = BuildToken<'EOF', ''>;
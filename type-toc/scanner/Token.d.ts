import { TokenType } from "../type";
import { Eq, Safe } from "../utils/common";
import { NumStr, Str2Num } from "../utils/string";

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
    value: Eq<Type, 'number'> extends true ? Str2Num<Safe<Lexeme, NumStr>> : null,
};

export type EOF = BuildToken<'EOF', ''>;
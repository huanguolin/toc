import { BuildToken, Token } from "../scanner/Token";
import { TokenType } from "../type";

type OpOrKeywordTokenType = Exclude<TokenType, 'number' | 'identifier' | 'EOF'>

export type TokenLike<T extends OpOrKeywordTokenType | Partial<Token>> =
    T extends OpOrKeywordTokenType
        ? BuildToken<T, T>
        : T extends Partial<Token>
            ? Token & T
            : never;

export type Identifier = TokenLike<{ type: 'identifier' }>;

export type Match<T, R extends Token[]> = [T, ...R];
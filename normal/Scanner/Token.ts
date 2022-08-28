export type TokenType = 'number' | '(' | ')' | '+' | '-' | '/' | '*';

export class Token {
    type: TokenType;
    lexeme: string;
    literal: number | null;

    constructor(type: TokenType, lexeme: string, literal: number | null = null) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
    }
}
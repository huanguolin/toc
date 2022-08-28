import { Token, TokenType } from "./Token";

export class Scanner {
    private source: string;
    private index: number;
    private tokens: Token[];

    constructor(source: string) {
        this.source = source;
        this.index = 0;
        this.tokens = [];
    }

    scan(): Token[] {
        while (!this.isAtEnd()) {
            let c = this.advance();
            switch (c) {
                case '(':
                case ')':
                case '*':
                case '/':
                case '+':
                case '-':
                    this.addToken(c, c);
                    break;
                case '\u0020':
                    break;
                default:
                    if (this.isNumberChar(c)) {
                        this.addNumber();
                        break;
                    }
                    throw "Unknown token at: " + c;
            }
        }
        this.addToken('EOF', '');
        return this.tokens;
    }

    private isAtEnd() {
        return this.index >= this.source.length;
    }

    private advance(): string {
        return this.source.charAt(this.index++);
    }

    private previous() {
        return this.source.charAt(this.index - 1)
    }

    private addToken(type: TokenType, lexeme: string, literal: number | null = null) {
        this.tokens.push(new Token(type, lexeme, literal));
    }

    private addNumber() {
        let c = this.previous();
        let numberStr = c;
        while (!this.isAtEnd()) {
            c = this.advance();
            if (!this.isNumberChar(c)) {
                --this.index;
                break;
            }
            numberStr += c;
        }
        this.addToken('number', numberStr, Number(numberStr));
    }

    private isNumberChar(c: string) {
        return c.length === 1 && c >= '0' && c <= '9';
    }
}
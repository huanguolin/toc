import { ScanError } from "./ScanError";
import { Token, TokenType } from "./Token";

export class Scanner {
    private static readonly keywords = new Set([
        'true',
        'false',
    ]);

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
                case '<':
                case '>':
                    if (this.match('=')) {
                        c += '=';
                    }
                    this.addToken(c as TokenType, c);
                    break;
                case '!':
                    if (this.match('=')) {
                        c += '=';
                    }
                    this.addToken(c as TokenType, c);
                    break;
                case '=':
                    if (this.match('=')) {
                        const r = '==';
                        this.addToken(r, r);
                        break;
                    }
                case '&':
                    if (this.match('&')) {
                        const r = '&&';
                        this.addToken(r, r);
                        break;
                    }
                case '|':
                    if (this.match('|')) {
                        const r = '||';
                        this.addToken(r, r);
                        break;
                    }
                    throw new ScanError("Unknown support token at: " + c);
                case '\u0020':
                    break;
                default:
                    if (this.isNumberChar(c)) {
                        this.addNumber();
                        break;
                    } else if (this.isAlphaChar(c)) {
                        this.addIdentifier();
                        break;
                    }
                    throw new ScanError("Unknown token at: " + c);
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

    private current() {
        return this.source.charAt(this.index);
    }

    private match(char: string) {
        if (this.isAtEnd()) {
            return false;
        } else if (this.current() === char) {
            this.advance();
            return true;
        }
        return false;
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

    private addIdentifier() {
        let c = this.previous();
        let name = c;
        while (!this.isAtEnd()) {
            c = this.advance();
            if (!this.isAlphaNumberChar(c)) {
                --this.index;
                break;
            }
            name += c;
        }
        const tokenType = Scanner.keywords.has(name) ? name : 'identifier';
        this.addToken(tokenType as TokenType, name, null);
    }

    private isAlphaNumberChar(c: string) {
        return this.isAlphaChar(c) || this.isNumberChar(c);
    }

    private isNumberChar(c: string) {
        return c.length === 1 && c >= '0' && c <= '9';
    }

    private isAlphaChar(c: string) {
        return c.length === 1
            && ((c >= 'a' && c <= 'z')
                || (c >= 'A' && c <= 'Z')
                || c === '_');
    }
}
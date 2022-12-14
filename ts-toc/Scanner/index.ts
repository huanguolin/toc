import { keywords as keywordList, TokenType } from '../type';

import { ScanError } from './ScanError';
import { Token } from './Token';

export class Scanner {
    private static readonly keywords = new Set(keywordList);

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
                case '{':
                case '}':
                case ',':
                case ';':
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
                case '!':
                case '=':
                    if (this.match('=')) {
                        c += '=';
                    }
                    this.addToken(c as TokenType, c);
                    break;
                case '&':
                    if (this.match('&')) {
                        const r = '&&';
                        this.addToken(r, r);
                        break;
                    }
                // eslint-disable-next-line no-fallthrough
                case '|':
                    if (this.match('|')) {
                        const r = '||';
                        this.addToken(r, r);
                        break;
                    }
                    throw new ScanError('Unknown token at: ' + c);
                case '\u0020':
                case '\n':
                case '\t':
                    break;
                case '"':
                    this.addString();
                    break;
                default:
                    if (this.isNumberChar(c)) {
                        this.addNumber();
                        break;
                    } else if (this.isAlphaChar(c)) {
                        this.addIdentifier();
                        break;
                    }
                    throw new ScanError('Unknown token at: ' + c);
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
        return this.source.charAt(this.index - 1);
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

    private addToken(
        type: TokenType,
        lexeme: string,
        literal: number | null = null,
    ) {
        this.tokens.push(new Token(type, lexeme, literal));
    }

    private addString() {
        let s = '';
        while (!this.isAtEnd() && this.current() !== '"') {
            if (this.current() === '\\') {
                this.advance();
                const c = this.advance();
                // https://en.wikipedia.org/wiki/Escape_character#:~:text=%5Bedit%5D-,JavaScript,-%5Bedit%5D
                if (ESCAPE_CHAR_MAP[c]) {
                    s += ESCAPE_CHAR_MAP[c];
                } else {
                    // \'
                    // \"
                    // \\
                    s += c;
                }
            } else {
                s += this.advance();
            }
        }

        if (this.isAtEnd()) {
            throw new ScanError('Unterminated string.');
        }

        // consume "
        this.advance();

        this.addToken('string', s);
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
        return (
            c.length === 1 &&
            ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_')
        );
    }
}

const ESCAPE_CHAR_MAP: { [key: string]: string } = {
    n: '\n',
    r: '\r',
    t: '\t',
    b: '\b',
    f: '\f',
    v: '\v',
    0: '\0',
};

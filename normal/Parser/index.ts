import { Token, TokenType } from "../Scanner/Token";
import { BinaryExpr } from "./BinaryExpr";
import { GroupExpr } from "./GroupExpr";
import { IExpr } from "./IExpr";
import { LiteralExpr } from "./LiteralExpr";

export class Parser {
    private tokens: Token[];
    private index: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    parse(): IExpr {
        if (this.isAtEnd()) {
            return new LiteralExpr(0);
        }
        return this.expression();
    }

    private expression(): IExpr {
        return this.term();
    }

    private term(): IExpr {
        let expr: IExpr = this.factor();
        while (this.match('+', '-')) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private factor(): IExpr {
        let expr: IExpr = this.primary();
        while (this.match('*', '/')) {
            const operator = this.previous();
            const right = this.primary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private primary(): IExpr {
        if (this.match('number')) {
            return new LiteralExpr(this.previous().literal);
        } else if (this.match('(')) {
            const expr = this.expression();
            this.consume(')', 'Expect ")" after expression.');
            return new GroupExpr(expr);
        }
        throw new Error('Expect expression.');
    }

    private isAtEnd() {
        return this.tokens[this.index].type === 'EOF';
    }

    private advance() {
        return this.tokens[this.index++];
    }

    private peek(i: number) {
        return this.tokens[this.index - i];
    }

    private current() {
        return this.peek(0);
    }

    private previous() {
        return this.peek(1);
    }

    private match(...tokenTypes: TokenType[]) {
        if (this.check(...tokenTypes)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(...tokenTypes: TokenType[]): boolean {
        if (this.isAtEnd()) {
            return false;
        }
        return tokenTypes.includes(this.current().type);
    }

    private consume(tokenType: TokenType, message: string) {
        if (this.check(tokenType)) {
            this.advance();
            return;
        }
        throw new Error(message);
    }
}
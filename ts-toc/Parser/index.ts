import { Token } from "../Scanner/Token";
import { TokenType } from "../type";
import { BinaryExpr } from "./Exprs/BinaryExpr";
import { GroupExpr } from "./Exprs/GroupExpr";
import { IExpr } from "./Exprs/IExpr";
import { LiteralExpr } from "./Exprs/LiteralExpr";
import { UnaryExpr } from "./Exprs/UnaryExpr";
import { ParseError } from "./ParseError";

export class Parser {
    private tokens: Token[];
    private index: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    parse(): IExpr {
        return this.expression();
    }

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
    private expression(): IExpr {
        return this.logicOr();
    }

    private logicOr() {
        let expr: IExpr = this.logicAnd();
        while (this.match('||')) {
            const operator = this.previous();
            const right = this.logicAnd();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private logicAnd() {
        let expr: IExpr = this.equality();
        while (this.match('&&')) {
            const operator = this.previous();
            const right = this.equality();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private equality(): IExpr {
        let expr: IExpr = this.relation();
        while (this.match('==', '!=')) {
            const operator = this.previous();
            const right = this.relation();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private relation(): IExpr {
        let expr: IExpr = this.additive();
        while (this.match('<', '>', '<=', '>=')) {
            const operator = this.previous();
            const right = this.additive();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private additive(): IExpr {
        let expr: IExpr = this.factor();
        while (this.match('+', '-')) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private factor(): IExpr {
        let expr: IExpr = this.unary();
        while (this.match('*', '/')) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private unary(): IExpr {
        if (this.match('!')) {
            const operator = this.previous();
            const expr = this.unary(); // 右结合
            return new UnaryExpr(operator, expr);
        }
        return this.primary();
    }

    private primary(): IExpr {
        if (this.match('number')) {
            return new LiteralExpr(this.previous().literal as number);
        } else if (this.match('true', 'false', 'null')) {
            const type = this.previous().type;
            if (type === 'null') {
                return new LiteralExpr(null);
            }
            return new LiteralExpr(type === 'true');
        } else if (this.match('string')) {
            return new LiteralExpr(this.previous().lexeme);
        } else if (this.match('(')) {
            const expr = this.expression();
            this.consume(')', 'Expect ")" after expression.');
            return new GroupExpr(expr);
        }
        throw new ParseError(`Expect expression, but got token: ${this.current().lexeme}.`);
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
        throw new ParseError(message);
    }
}
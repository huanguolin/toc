import { Token, TokenType } from "../Scanner/Token";
import { BinaryExpr } from "./Exprs/BinaryExpr";
import { GroupExpr } from "./Exprs/GroupExpr";
import { IExpr } from "./Exprs/IExpr";
import { LiteralExpr } from "./Exprs/LiteralExpr";
import { UnaryExpr } from "./Exprs/UnaryExpr";
import { ExprStmt } from "./Stmts/ExprStmt";
import { IStmt } from "./Stmts/IStmt";

export class Parser {
    private tokens: Token[];
    private index: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    parse(): IStmt[] {
        const stmts: IStmt[] = [];
        while (!this.isAtEnd()) {
            stmts.push(this.statement());
        }
        return stmts;
    }

    statement(): IStmt {
        return this.expressionStatement();
    }

    expressionStatement(): IStmt {
        const expr = this.expression();
        this.consume(';', 'Expect ";" after expression.');
        return new ExprStmt(expr);
    }

    // 表达式分类并按照由低到高：
    // logic or:    ||          左结合
    // logic and:   &&          左结合
    // equality:    == !=       左结合
    // relation:    < > <= >=   左结合
    // term:        + -         左结合
    // factor:      * /         左结合
    // unary:       !           右结合
    // primary:     number ()
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
        let expr: IExpr = this.term();
        while (this.match('<', '>', '<=', '>=')) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
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
        } else if (this.match('true', 'false')) {
            return new LiteralExpr(this.previous().type === 'true');
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
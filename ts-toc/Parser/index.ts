import { Token } from '../Scanner/Token';
import { TokenType } from '../type';

import { AssignExpr } from './Exprs/AssignExpr';
import { BinaryExpr } from './Exprs/BinaryExpr';
import { CallExpr } from './Exprs/CallExpr';
import { GroupExpr } from './Exprs/GroupExpr';
import { IExpr } from './Exprs/IExpr';
import { LiteralExpr } from './Exprs/LiteralExpr';
import { UnaryExpr } from './Exprs/UnaryExpr';
import { VariableExpr } from './Exprs/VariableExpr';
import { ParseError } from './ParseError';
import { BlockStmt } from './Stmts/BlockStmt';
import { ExprStmt } from './Stmts/ExprStmt';
import { ForStmt } from './Stmts/ForStmt';
import { FunStmt } from './Stmts/FunStmt';
import { IStmt } from './Stmts/IStmt';
import { IfStmt } from './Stmts/IfStmt';
import { VarStmt } from './Stmts/VarStmt';

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
            stmts.push(this.declaration());
        }
        return stmts;
    }

    private declaration() {
        if (this.match('var')) {
            return this.varDeclaration();
        } else if (this.match('fun')) {
            return this.funDeclaration();
        }

        return this.statement();
    }

    private funDeclaration() {
        this.consume('identifier', `Expect function name.`);
        const name = this.previous();
        this.consume('(', `Expect '(' after function name.`);
        let params: Token[] = [];
        if (!this.match(')')) {
            params = this.parameters();
            this.consume(')', `Expect ')' after function parameters.`);
        }
        this.consume('{', `Expect '{' before function body.`);
        const body = this.blockStatement();
        return new FunStmt(name, params, body);
    }

    private parameters(): Token[] {
        const params: Token[] = [];
        do {
            this.consume('identifier', 'Expect parameter name.');
            params.push(this.previous());
        } while (this.match(','));
        return params;
    }

    private varDeclaration() {
        this.consume('identifier', `Expect var name.`);
        const name = this.previous();
        let initializer = null;
        if (this.match('=')) {
            initializer = this.expression();
        }
        this.consume(';', `Expect ';' after var declaration.`);
        return new VarStmt(name, initializer);
    }

    private statement(): IStmt {
        if (this.match('{')) {
            return this.blockStatement();
        } else if (this.match('if')) {
            return this.ifStatement();
        } else if (this.match('for')) {
            return this.forStatement();
        }
        return this.expressionStatement();
    }

    private forStatement() {
        this.consume('(', 'Expect "(" after for keyword.');

        let initializer: IStmt | null;
        if (this.match(';')) {
            initializer = null;
        } else if (this.match('var')) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition: IExpr | null;
        if (this.match(';')) {
            condition = null;
        } else {
            condition = this.expression();
            this.consume(';', 'Expect ";" after for condition.');
        }

        let increment: IExpr | null;
        if (this.match(')')) {
            increment = null;
        } else {
            increment = this.expression();
            this.consume(')', 'Expect ")" after for increment.');
        }

        const body = this.statement();
        return new ForStmt(initializer, condition, increment, body);
    }

    private ifStatement() {
        this.consume('(', 'Expect "(" before if condition.');
        const condition = this.expression();
        this.consume(')', 'Expect ")" after if condition.');
        const ifClause = this.statement();
        let elseClause = null;
        if (this.match('else')) {
            elseClause = this.statement();
        }
        return new IfStmt(condition, ifClause, elseClause);
    }

    private blockStatement() {
        const stmts: IStmt[] = [];
        while (!this.isAtEnd() && !this.match('}')) {
            stmts.push(this.declaration());
        }

        if (this.previous().type !== '}') {
            throw new ParseError('Expect "}" end the block.');
        }

        return new BlockStmt(stmts);
    }

    private expressionStatement() {
        const expr = this.expression();
        this.consume(';', 'Expect ";" after expression.');
        return new ExprStmt(expr);
    }

    // 优先级、结合性参考 C 语言：https://www.tutorialspoint.com/cprogramming/c_operators_precedence.htm
    // 表达式分类并按照由低到高：
    // assign:      =                   右结合
    // logic or:    ||                  左结合
    // logic and:   &&                  左结合
    // equality:    == !=               左结合
    // relation:    < > <= >=           左结合
    // additive:    + -                 左结合
    // factor:      * / %               左结合
    // unary:       !                   右结合
    // call:        primary(arg?)       左结合
    // primary:     number boolean null 'identifier' ()
    private expression(): IExpr {
        return this.assign();
    }

    private assign(): IExpr {
        const left = this.logicOr();
        if (this.match('=')) {
            const right = this.assign();

            if (left instanceof VariableExpr) {
                return new AssignExpr(left.name, right);
            }

            throw new ParseError('Invalid assignment target.');
        }
        return left;
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
        return this.call();
    }

    private call(): IExpr {
        let expr = this.primary();
        while (this.match('(')) {
            let args: IExpr[] = [];
            if (!this.match(')')) {
                args = this.arguments();
                this.consume(')', 'Expect ")" end fun call.');
            }
            expr = new CallExpr(expr, args);
        }
        return expr;
    }

    private arguments(): IExpr[] {
        const args: IExpr[] = [];
        do {
            args.push(this.expression());
        } while (this.match(','));
        return args;
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
        } else if (this.match('identifier')) {
            return new VariableExpr(this.previous());
        } else if (this.match('(')) {
            const expr = this.expression();
            this.consume(')', 'Expect ")" after expression.');
            return new GroupExpr(expr);
        }
        throw new ParseError(
            `Expect expression, but got token: ${this.current().lexeme}.`,
        );
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

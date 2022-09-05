import { BinaryExpr } from "../Parser/BinaryExpr";
import { GroupExpr } from "../Parser/GroupExpr";
import { IExpr } from "../Parser/IExpr";
import { IVisitor } from "../Parser/IVisitor";
import { LiteralExpr } from "../Parser/LiteralExpr";
import { UnaryExpr } from "../Parser/UnaryExpr";
import { RuntimeError } from "./RuntimeError";

export class Interpreter implements IVisitor<unknown> {
    private expr: IExpr;

    constructor(expr: IExpr) {
        this.expr = expr;
    }

    interpret() {
        return this.expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): number | boolean {
        const operator = expr.operator;
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);
        if (this.isNumber(left) && this.isNumber(right)) {
            switch (operator.type) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '<': return left < right;
                case '>': return left > right;
                case '<=': return left <= right;
                case '>=': return left >= right;
                default: throw new RuntimeError('Unknown operator: ' + operator.lexeme);
            }
        } else {
            throw new RuntimeError(`Require two numbers, but get: left=${left}, right=${right}`);
        }
    }

    visitUnaryExpr(expr: UnaryExpr): boolean {
        const v = expr.expression.accept(this);
        if (expr.operator.type === '!') {
            return !v;
        }
        throw new RuntimeError('Unknown unary operator: ' + expr.operator.type);
    }

    visitGroupExpr(expr: GroupExpr): number | boolean {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(expr: LiteralExpr): number | boolean {
        return expr.value;
    }

    isNumber(x: unknown): x is number {
        return typeof x === 'number';
    }
}
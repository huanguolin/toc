import { BinaryExpr } from "../Parser/Exprs/BinaryExpr";
import { GroupExpr } from "../Parser/Exprs/GroupExpr";
import { IExpr } from "../Parser/Exprs/IExpr";
import { IExprVisitor } from "../Parser/Exprs/IExprVisitor";
import { LiteralExpr } from "../Parser/Exprs/LiteralExpr";
import { UnaryExpr } from "../Parser/Exprs/UnaryExpr";
import { ValueType } from "../type";
import { RuntimeError } from "./RuntimeError";

export class Interpreter implements IExprVisitor<unknown> {
    constructor() {
    }

    interpret(expr: IExpr): ValueType {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): ValueType {
        const operator = expr.operator;

        const leftValue = expr.left.accept(this);
        // && || 需要考虑短路
        if (operator.type == '&&') {
            return leftValue && expr.right.accept(this);
        } else if (operator.type == '||') {
            return leftValue || expr.right.accept(this);
        } else {
            // 不需要考虑短路的，可直接求出右值
            const rightValue = expr.right.accept(this);
            if (operator.type == '+') {
                if (this.isString(leftValue) && this.isString(rightValue)) {
                    return leftValue + rightValue;
                } else if (this.isNumber(leftValue) && this.isNumber(rightValue)) {
                    return leftValue + rightValue;
                }
                throw new RuntimeError('"+" operator only support both operand is string or number.');
            } else if (operator.type == '==') {
                return leftValue == rightValue;
            } else if (operator.type == '!=') {
                 return leftValue != rightValue;
            } else {
                // 纯数字运算
                if (this.isNumber(leftValue) && this.isNumber(rightValue)) {
                    return this.evalMath(operator.type, leftValue, rightValue);
                }
                throw new RuntimeError(`Required both operand is number for operator ${operator.type}: left=${leftValue}, right=${rightValue}`);
            }
        }
    }

    visitUnaryExpr(expr: UnaryExpr): boolean {
        const v = expr.expression.accept(this);
        if (expr.operator.type === '!') {
            return !v;
        }
        throw new RuntimeError('Unknown unary operator: ' + expr.operator.type);
    }

    visitGroupExpr(expr: GroupExpr): ValueType {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(expr: LiteralExpr): ValueType {
        return expr.value;
    }


    private isNumber(x: unknown): x is number {
        return typeof x === 'number';
    }

    private isString(x: unknown): x is string {
        return typeof x === 'string';
    }

    private evalMath(op: string, x: number, y: number): number | boolean {
        switch (op) {
            case '-': return x - y;
            case '*': return x * y;
            case '/': return x / y;
            case '<': return x < y;
            case '>': return x > y;
            case '<=': return x <= y;
            case '>=': return x >= y;
            default:
                throw new RuntimeError('Unknown operator: ' + op);
        }
    }
}
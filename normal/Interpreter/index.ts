import { BinaryExpr } from "../Parser/BinaryExpr";
import { GroupExpr } from "../Parser/GroupExpr";
import { IExpr } from "../Parser/IExpr";
import { IVisitor } from "../Parser/IVisitor";
import { LiteralExpr } from "../Parser/LiteralExpr";
import { UnaryExpr } from "../Parser/UnaryExpr";
import { RuntimeError } from "./RuntimeError";

const BinaryEvalMapping = {
    '+': [isNumber, (a: number, b: number) => a + b],
    '-': [isNumber, (a: number, b: number) => a - b],
    '*': [isNumber, (a: number, b: number) => a * b],
    '/': [isNumber, (a: number, b: number) => a / b],
    '<': [isNumber, (a: number, b: number) => a < b],
    '>': [isNumber, (a: number, b: number) => a > b],
    '<=': [isNumber, (a: number, b: number) => a <= b],
    '>=': [isNumber, (a: number, b: number) => a >= b],
    '==': [isAny, (a: unknown, b: unknown) => a === b],
    '!=': [isAny, (a: unknown, b: unknown) => a !== b],
    '&&': [isAny, (a: unknown, b: unknown) => a && b],
    '||': [isAny, (a: unknown, b: unknown) => a || b],
} as const;

function isNumber(x: unknown): x is number {
    return typeof x === 'number';
}

function isAny(x: unknown): x is any {
    return true;
}

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

        const mapping = BinaryEvalMapping[operator.type];
        if (!mapping) {
            throw new RuntimeError('Unknown operator: ' + operator.lexeme);
        }

        const [check, evalFn] = mapping;
        if (check(left) && check(right)) {
            return evalFn(left, right);
        } else {
            throw new RuntimeError(`Check data type failed for operator ${operator.type}: left=${left}, right=${right}`);
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
}

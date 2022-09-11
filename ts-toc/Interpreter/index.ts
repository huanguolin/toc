import { AssignExpr } from "../Parser/Exprs/AssignExpr";
import { BinaryExpr } from "../Parser/Exprs/BinaryExpr";
import { GroupExpr } from "../Parser/Exprs/GroupExpr";
import { IExprVisitor } from "../Parser/Exprs/IExprVisitor";
import { LiteralExpr } from "../Parser/Exprs/LiteralExpr";
import { UnaryExpr } from "../Parser/Exprs/UnaryExpr";
import { VariableExpr } from "../Parser/Exprs/VariableExpr";
import { ExprStmt } from "../Parser/Stmts/ExprStmt";
import { IStmt } from "../Parser/Stmts/IStmt";
import { IStmtVisitor } from "../Parser/Stmts/IStmtVisitor";
import { VarStmt } from "../Parser/Stmts/varStmt";
import { ValueType } from "../type";
import { Environment } from "./Environment";
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

export class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    private global: Environment;
    private stmts: IStmt[];

    constructor() {
        this.global = new Environment(null);
    }

    interpret(stmts: IStmt[]) {
        this.stmts = stmts;

        let lastResult: unknown = null;
        for (let i = 0; i < this.stmts.length; i++) {
            const stmt = this.stmts[i];
            lastResult = stmt.accept(this);
        }
        return lastResult;
    }

    visitVarStmt(stmt: VarStmt): ValueType {
        let initializer = null;
        if (stmt.initializer) {
            initializer = stmt.initializer.accept(this);
        }
        this.global.define(stmt.name, initializer);
        return initializer;
    }

    visitExprStmt(stmt: ExprStmt): number | boolean {
        return stmt.expression.accept(this);
    }

    visitAssignExpr(expr: AssignExpr): ValueType {
        const v = expr.right.accept(this);
        this.global.assign(expr.varName, v);
        return v;
    }

    visitVariableExpr(expr: VariableExpr): ValueType {
        return this.global.get(expr.name);
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

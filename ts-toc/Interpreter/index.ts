import { FunObject } from '../FunObject';
import { AssignExpr } from '../Parser/Exprs/AssignExpr';
import { BinaryExpr } from '../Parser/Exprs/BinaryExpr';
import { CallExpr } from '../Parser/Exprs/CallExpr';
import { GroupExpr } from '../Parser/Exprs/GroupExpr';
import { IExprVisitor } from '../Parser/Exprs/IExprVisitor';
import { LiteralExpr } from '../Parser/Exprs/LiteralExpr';
import { UnaryExpr } from '../Parser/Exprs/UnaryExpr';
import { VariableExpr } from '../Parser/Exprs/VariableExpr';
import { BlockStmt } from '../Parser/Stmts/BlockStmt';
import { ExprStmt } from '../Parser/Stmts/ExprStmt';
import { ForStmt } from '../Parser/Stmts/ForStmt';
import { FunStmt } from '../Parser/Stmts/FunStmt';
import { IStmt } from '../Parser/Stmts/IStmt';
import { IStmtVisitor } from '../Parser/Stmts/IStmtVisitor';
import { IfStmt } from '../Parser/Stmts/IfStmt';
import { VarStmt } from '../Parser/Stmts/varStmt';
import { ValueType } from '../type';

import { Environment } from './Environment';
import { RuntimeError } from './RuntimeError';

export class Interpreter
    implements IExprVisitor<unknown>, IStmtVisitor<unknown>
{
    private environment: Environment;

    constructor() {
        this.environment = new Environment(null);
    }

    interpret(stmts: IStmt[]): ValueType {
        let lastResult: ValueType = null;
        for (const stmt of stmts) {
            lastResult = stmt.accept(this);
        }
        return lastResult;
    }

    visitForStmt(stmt: ForStmt): ValueType {
        const previousEnv = this.environment;
        this.environment = new Environment(this.environment);

        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }

        let conditionResult: ValueType = true;
        if (stmt.condition) {
            conditionResult = stmt.condition.accept(this);
        }

        let result: ValueType = null;
        while (conditionResult) {
            result = stmt.body.accept(this);
            if (stmt.increment) {
                stmt.increment.accept(this);
            }
            if (stmt.condition) {
                conditionResult = stmt.condition.accept(this);
            }
        }

        this.environment = previousEnv;
        return result;
    }

    visitFunStmt(stmt: FunStmt): FunObject {
        const funObj = new FunObject(stmt, this.environment);
        this.environment.define(stmt.name, funObj);
        return funObj;
    }

    visitIfStmt(stmt: IfStmt): ValueType {
        const cond = stmt.condition.accept(this);
        if (cond) {
            return stmt.ifClause.accept(this);
        } else if (stmt.elseClause) {
            return stmt.elseClause.accept(this);
        }
        return null;
    }

    visitBlockStmt(blockStmt: BlockStmt): ValueType {
        const result = this.executeBlock(
            blockStmt,
            new Environment(this.environment),
        );

        return result;
    }

    executeBlock(blockStmt: BlockStmt, env: Environment): ValueType {
        const previousEnv = this.environment;

        try {
            this.environment = env;

            let lastResult: ValueType = null;
            for (const stmt of blockStmt.stmts) {
                lastResult = stmt.accept(this);
            }
            return lastResult;
        } finally {
            this.environment = previousEnv;
        }
    }

    visitVarStmt(stmt: VarStmt): ValueType {
        let initializer = null;
        if (stmt.initializer) {
            initializer = stmt.initializer.accept(this);
        }
        this.environment.define(stmt.name, initializer);
        return initializer;
    }

    visitExprStmt(stmt: ExprStmt): ValueType {
        return stmt.expression.accept(this);
    }

    visitAssignExpr(expr: AssignExpr): ValueType {
        const v = expr.right.accept(this);
        this.environment.assign(expr.varName, v);
        return v;
    }

    visitVariableExpr(expr: VariableExpr): ValueType {
        return this.environment.get(expr.name);
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
                } else if (
                    this.isNumber(leftValue) &&
                    this.isNumber(rightValue)
                ) {
                    return leftValue + rightValue;
                }
                throw new RuntimeError(
                    '"+" operator only support both operand is string or number.',
                );
            } else if (operator.type == '==') {
                return leftValue == rightValue;
            } else if (operator.type == '!=') {
                return leftValue != rightValue;
            } else {
                // 纯数字运算
                if (this.isNumber(leftValue) && this.isNumber(rightValue)) {
                    return this.evalMath(operator.type, leftValue, rightValue);
                }
                throw new RuntimeError(
                    `Required both operand is number for operator ${operator.type}: left=${leftValue}, right=${rightValue}`,
                );
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

    visitCallExpr(expr: CallExpr): ValueType {
        const callee = expr.callee.accept(this);

        if (callee instanceof FunObject) {
            return callee.execute(expr.args, this);
        }

        throw new RuntimeError(
            `Callee must be a 'FunObject', but got: ${callee}(${typeof callee})`,
        );
    }

    visitGroupExpr(expr: GroupExpr): ValueType {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(expr: LiteralExpr): Exclude<ValueType, FunObject> {
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
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                return x / y;
            case '<':
                return x < y;
            case '>':
                return x > y;
            case '<=':
                return x <= y;
            case '>=':
                return x >= y;
            default:
                throw new RuntimeError('Unknown operator: ' + op);
        }
    }
}

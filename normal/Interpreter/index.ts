import { BinaryExpr } from "../Parser/BinaryExpr";
import { GroupExpr } from "../Parser/GroupExpr";
import { IExpr } from "../Parser/IExpr";
import { IVisitor } from "../Parser/IVisitor";
import { LiteralExpr } from "../Parser/LiteralExpr";

export class Interpreter implements IVisitor {
    private expr: IExpr;

    constructor(expr: IExpr) {
        this.expr = expr;
    }

    interpret() {
        return this.expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): number {
        const operator = expr.operator;
        const left = expr.left.accept(this);
        const right = expr.right.accept(this);
        switch (operator.type) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            default: throw new Error('Cannot be here!');
        }
    }

    visitGroupExpr(expr: GroupExpr): number {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(expr: LiteralExpr): number {
        return expr.value;
    }
}
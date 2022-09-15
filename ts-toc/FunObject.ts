import { Interpreter } from "./Interpreter";
import { Environment } from "./Interpreter/Environment";
import { RuntimeError } from "./Interpreter/RuntimeError";
import { IExpr } from "./Parser/Exprs/IExpr";
import { FunStmt } from "./Parser/Stmts/FunStmt";
import { ValueType } from "./type";

export class FunObject {
    private declaration: FunStmt;
    private environment: Environment;

    constructor(declaration: FunStmt, env: Environment) {
        this.declaration = declaration;
        this.environment = env;
    }

    execute(args: IExpr[], interpreter: Interpreter): ValueType {
        if (args.length !== this.declaration.parameters.length) {
            throw new RuntimeError('Arguments length not match parameters.');
        }

        const env = new Environment(this.environment);
        const parameters = this.declaration.parameters;
        for (let i = 0; i < args.length; i++) {
            const argValue = args[i].accept(interpreter);
            const param = parameters[i];
            env.define(param, argValue);
        }

        return interpreter.executeBlock(this.declaration.body, env);
    }

    toString() {
        const { name, parameters } = this.declaration;
        const params = parameters.map(t => t.lexeme).join(', ');
        return `<fun ${name.lexeme}(${params})>`;
    }
}
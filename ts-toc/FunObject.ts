import { Environment } from "./Interpreter/Environment";
import { FunStmt } from "./Parser/Stmts/FunStmt";

export class FunObject {
    private declaration: FunStmt;
    private environment: Environment;

    constructor(declaration: FunStmt, env: Environment) {
        this.declaration = declaration;
        this.environment = env;
    }

    toString() {
        const { name, parameters } = this.declaration;
        const params = parameters.map(t => t.lexeme).join(', ');
        return `<fun ${name.lexeme}(${params})>`;
    }
}
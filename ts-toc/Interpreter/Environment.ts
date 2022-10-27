import { Token } from "../Scanner/Token";
import { ValueType } from "../type";
import { RuntimeError } from "./RuntimeError";

export class Environment {
    private store: Map<string, ValueType>;
    private outer: Environment | null;

    constructor(outer: Environment | null) {
        this.store = new Map<string, ValueType>();
        this.outer = outer;
    }

    get(name: Token): ValueType {
        let v = this.store.get(name.lexeme);
        if (v === undefined && this.outer) {
            v = this.outer.get(name);
        }

        if (v === undefined) {
            throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
        }

        return v;
    }

    define(name: Token, value: ValueType) {
        if (this.store.has(name.lexeme)) {
            throw new RuntimeError(`Variable '${name.lexeme}' is already defined.`);
        }

        this.store.set(name.lexeme, value);
    }

    assign(name: Token, value: ValueType) {
        if (this.store.has(name.lexeme)) {
            this.store.set(name.lexeme, value);
            return;
        }

        if (this.outer) {
            this.outer.assign(name, value);
        }

        throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
    }
}
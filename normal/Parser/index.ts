import { Token } from "../Scanner/Token";
import { Expr } from "./Expr";

export class Parser {
    private tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Expr {
        return this.tokens as any;
    }

    expect(tokens: Token[], i: number, s: string) {
        if (i >= tokens.length) {
            throw `Expect ${s} but get end.`;
        } else if (tokens[i + 1].lexeme !== s) {
            throw `Expect ${s} but get ${tokens[i + 1].lexeme}.`;
        }
    }
}
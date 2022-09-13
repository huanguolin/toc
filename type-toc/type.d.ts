import { FunObject } from "./FunObject";

export type TokenType =
    | 'identifier'
    | 'number'
    | 'fun'
    | 'if'
    | 'else'
    | 'var'
    | 'true'
    | 'false'
    | 'null'
    | '{'
    | '}'
    | ','
    | ';'
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '%'
    | '<'
    | '>'
    | '='
    | '<='
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||'
    | '!'
    | 'EOF';

export type Keywords = {
    fun: true,
    true: true,
    false: true,
    null: true,
    var: true,
    if: true,
    else: true,
};

export type ValueType = FunObject | number | boolean | null;

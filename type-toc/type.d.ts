import { FunObject } from "./FunObject";

export type TokenType =
    | 'identifier'
    | 'number'
    | 'fun'
    | 'for'
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
    for: true,
};

export type ValueType = FunObject | number | boolean | null;

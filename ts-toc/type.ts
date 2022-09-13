import { FunObject } from "./FunObject";
import { Environment } from "./Interpreter/Environment";
import { FunStmt } from "./Parser/Stmts/FunStmt";

export type TokenType =
    | 'identifier'
    | 'number'
    | 'fun'
    | 'var'
    | 'if'
    | 'else'
    | 'true'
    | 'false'
    | 'null'
    | '{'
    | '}'
    | ';'
    | ','
    | '='
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '<'
    | '>'
    | '<='
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||'
    | '!'
    | 'EOF';

export const keywords = [
    'fun',
    'if',
    'else',
    'var',
    'true',
    'false',
    'null',
];

export type ValueType = FunObject | number | boolean | null;

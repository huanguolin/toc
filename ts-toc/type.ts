import { FunObject } from "./FunObject";
import { Environment } from "./Interpreter/Environment";
import { FunStmt } from "./Parser/Stmts/FunStmt";

export type TokenType =
    | 'identifier'
    | 'number'
    | 'fun'
    | 'var'
    | 'for'
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
    'for',
    'if',
    'else',
    'var',
    'true',
    'false',
    'null',
];

export type ValueType = FunObject | number | boolean | null;

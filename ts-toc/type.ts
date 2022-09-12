export type TokenType =
    | 'identifier'
    | 'number'
    | 'var'
    | 'if'
    | 'else'
    | 'true'
    | 'false'
    | 'null'
    | '{'
    | '}'
    | '='
    | ';'
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
    'if',
    'else',
    'var',
    'true',
    'false',
    'null',
];

export type ValueType = number | boolean | null;
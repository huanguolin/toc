export type TokenType =
    | 'identifier'
    | 'var'
    | 'number'
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
    'var',
    'true',
    'false',
    'null',
];

export type ValueType = number | boolean | null;
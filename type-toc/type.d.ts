
export type TokenType =
    | 'identifier'
    | 'number'
    | 'true'
    | 'false'
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
    | '<='
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||'
    | '!'
    | 'EOF';

export type Keywords = {
    true: true,
    false: true,
};

export type ValueType = number | boolean | null;
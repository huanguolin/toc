
export type TokenType =
    | 'identifier'
    | 'number'
    | 'true'
    | 'false'
    | 'null'
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
    null: true,
};

export type ValueType = number | boolean | null;
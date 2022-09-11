
export type TokenType =
    | 'identifier'
    | 'var'
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
    true: true,
    false: true,
    null: true,
    var: true,
};

export type ValueType = number | boolean | null;
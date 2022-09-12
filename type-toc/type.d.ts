
export type TokenType =
    | 'identifier'
    | 'number'
    | 'if'
    | 'else'
    | 'var'
    | 'true'
    | 'false'
    | 'null'
    | '{'
    | '}'
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
    if: true,
    else: true,
};

export type ValueType = number | boolean | null;

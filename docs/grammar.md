# Toc Grammar
## Syntax Grammar
```shell
program        → declaration* EOF ;

# declarations
declaration    → funDecl
               | varDecl
               | statement ;

funDecl        → "fun" function ;
varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

function       → IDENTIFIER "(" parameters? ")" block ;
parameters     → IDENTIFIER ( "," IDENTIFIER )* ;


# statements
statement      → exprStmt
               | forStmt
               | ifStmt
               | block ;

exprStmt       → expression ";" ;
forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
                           expression? ";"
                           expression? ")" statement ;
ifStmt         → "if" "(" expression ")" statement
                 ( "else" statement )? ;
block          → "{" declaration* "}" ;

# expressions
expression     → assignment ;

assignment     → IDENTIFIER "=" assignment
               | logic_or ;

logic_or       → logic_and ( "||" logic_and )* ;
logic_and      → equality ( "&&" equality )* ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → additive ( ( ">" | ">=" | "<" | "<=" ) additive )* ;
additive       → factor ( ( "-" | "+" ) factor )* ;
factor         → unary ( ( "/" | "*" | "%" ) unary )* ;

unary          → "!" unary | call ;
call           → primary ( "(" arguments? ")" )* ;
primary        → "true" | "false" | "null" | NUMBER | STRING | IDENTIFIER | "(" expression ")";

arguments      → expression ( "," expression )* ;
```

## Lexical Grammar
```shell
NUMBER         → DIGIT+ ;
STRING         → "\"" <any char except "\"">* "\"" ;
IDENTIFIER     → ALPHA ( ALPHA | DIGIT )* ;
ALPHA          → "a" ... "z" | "A" ... "Z" | "_" ;
DIGIT          → "0" ... "9" ;
```
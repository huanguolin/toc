use crate::{
    error::{TocErr, TocErrKind},
    expr::{
        AssignExpr, BinaryExpr, CallExpr, Expr,
        Expr::{Assign, Binary, Call, Group, Literal, Unary, Variable},
        GroupExpr, LiteralExpr, UnaryExpr, VariableExpr,
    },
    token::{
        keyword::Keyword,
        symbol::Symbol,
        Token,
    },
};

pub fn parse(tokens: Vec<Token>) -> Result<Expr, TocErr> {
    Parser::new(tokens).parse()
}

/**
 * Only for inner use.
 */
struct Parser {
    tokens: Vec<Token>,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Parser { tokens }
    }

    fn parse(&mut self) -> Result<Expr, TocErr> {
        self.parse_expr()
    }

    // 优先级、结合性参考 C 语言：https://www.tutorialspoint.com/cprogramming/c_operators_precedence.htm
    // 表达式分类并按照由低到高：
    // assign:      =                   右结合
    // logic or:    ||                  左结合
    // logic and:   &&                  左结合
    // equality:    == !=               左结合
    // relation:    < > <= >=           左结合
    // additive:    + -                 左结合
    // factor:      * / %               左结合
    // unary:       !                   右结合
    // call:        primary(arg?)       左结合
    // primary:     number boolean null 'identifier' ()

    fn parse_expr(&mut self) -> Result<Expr, TocErr> {
        self.parse_assign_expr()
    }

    fn parse_assign_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_logic_or_expr()?;
        while let Some(assign) = self.get_symbol(&[Symbol::Assign]) {
            let right = Box::new(self.parse_logic_or_expr()?);
            if let Variable(var) = expr {
                expr = Assign(AssignExpr {
                    var_name: var.var_name,
                    right,
                })
            } else {
                return Err(TocErr::new(
                    TocErrKind::ParseFail,
                    format!("Invalid assignment target before {}.", assign),
                ));
            }
        }
        Ok(expr)
    }

    fn parse_logic_or_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_logic_and_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::Or]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_logic_and_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_logic_and_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_equality_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::And]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_equality_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_equality_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_relation_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::Equal]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_relation_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_relation_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_additive_expr()?;
        while let Some(token) = self.get_symbol(&[
            Symbol::Greater,
            Symbol::GreaterEqual,
            Symbol::Less,
            Symbol::LessEqual,
        ]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_additive_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_additive_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_factor_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::Plus, Symbol::Minus]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_factor_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_factor_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_unary_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::Star, Symbol::Slash]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_unary_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_unary_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_call_expr()?;
        if let Some(token) = self.get_symbol(&[Symbol::Bang]) {
            let op = token;
            let right = Box::new(self.parse_unary_expr()?);
            expr = Unary(UnaryExpr { op, expr: right });
        }
        Ok(expr)
    }

    fn parse_call_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_primary()?;
        while let Some(token) = self.get_symbol(&[Symbol::LeftParen]) {
            let callee = Box::new(expr);
            let left_paren = token;
            let mut args: Vec<Expr> = Vec::new();
            if let None = self.get_symbol(&[Symbol::RightParen]) {
                args = self.parse_arguments()?;
            }
            expr = Call(CallExpr {
                callee,
                left_paren,
                args,
            });
        }
        Ok(expr)
    }

    fn parse_arguments(&mut self) -> Result<Vec<Expr>, TocErr> {
        let mut args: Vec<Expr> = Vec::new();
        loop {
            args.push(self.parse_expr()?);
            if let Some(_) = self.get_symbol(&[Symbol::RightParen]) {
                break;
            }
        }
        Ok(args)
    }

    fn parse_primary(&mut self) -> Result<Expr, TocErr> {
        let token = self.shift();
        match &token {
            Token::Number(n, _) => Ok(Literal(LiteralExpr::Number(n.clone(), token))),
            Token::String(s, _) => Ok(Literal(LiteralExpr::String(s.clone(), token))),
            Token::Keyword(k, _) if token.is_literal_keyword() => {
                Ok(Literal(if *k == Keyword::Null {
                    LiteralExpr::Null(token)
                } else {
                    LiteralExpr::Bool(*k == Keyword::True, token)
                }))
            }
            Token::Identifier(_, _) => Ok(Variable(VariableExpr { var_name: token })),
            Token::Symbol(sym, _) if *sym == Symbol::LeftParen => {
                let expr = self.parse_expr()?;
                self.expect_symbol(
                    &[Symbol::RightParen],
                    format!("Expect ')' after expression, but got token {}.", token),
                )?;
                Ok(Group(GroupExpr {
                    left_paren: token,
                    expr: Box::new(expr),
                }))
            }
            _ => Err(TocErr::new(
                TocErrKind::ParseFail,
                format!("Expect expression, but got token {}.", token),
            )),
        }
    }

    fn is_end(&self) -> bool {
        self.tokens.len() == 0
    }

    fn shift(&mut self) -> Token {
        self.tokens.remove(0)
    }

    fn current(&self) -> &Token {
        &self.tokens[0]
    }

    fn get_symbol(&mut self, symbols: &[Symbol]) -> Option<Token> {
        if self.is_end() {
            return None;
        }

        match self.current() {
            Token::Symbol(s, _) if symbols.contains(&s) => Some(self.shift()),
            _ => None,
        }
    }

    fn expect_symbol(&mut self, symbols: &[Symbol], msg: String) -> Result<(), TocErr> {
        if !self.is_end() {
            if let Token::Symbol(s, _) = self.current() {
                if symbols.contains(&s) {
                    self.shift();
                    return Ok(());
                }
            }
        }

        Err(TocErr::new(TocErrKind::ParseFail, msg))
    }
}

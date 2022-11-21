use crate::{
    error::{TocErr, TocErrKind},
    expr::expr::{BinaryExpr, Expr, LiteralExpr},
    token::{
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

    fn parse_expr(&mut self) -> Result<Expr, TocErr> {
        self.parse_additive_expr()
    }

    fn parse_additive_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_factor_expr()?;
        while let Some(token) = self.get_symbol(&[Symbol::Plus, Symbol::Minus]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_factor_expr()?);
            expr = Expr::Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_factor_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_primary()?;
        while let Some(token) = self.get_symbol(&[Symbol::Star, Symbol::Slash]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_primary()?);
            expr = Expr::Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_primary(&mut self) -> Result<Expr, TocErr> {
        let token = self.shift();
        match token {
            Token::Number(n, _) => Ok(Expr::Literal(LiteralExpr::Number(n))),
            _ => Err(TocErr::new(
                TocErrKind::ParseFail,
                format!("Expect expression, but got token {}.", token)))
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
            return None
        }

        match self.current() {
            Token::Symbol(s, _) => {
                if symbols.contains(&s) {
                    Some(self.shift())
                } else {
                    None
                }
            }
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

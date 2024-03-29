use crate::{
    error::{TocErr, TocErrKind},
    expr::{
        AssignExpr, BinaryExpr, CallExpr, Expr, Expr::*, GroupExpr, LiteralExpr, UnaryExpr,
        VariableExpr,
    },
    stmt::{BlockStmt, ExprStmt, ForStmt, FunStmt, IfStmt, Stmt, VarStmt},
    token::{keyword::Keyword, symbol::Symbol, Token},
};

pub fn parse(tokens: Vec<Token>) -> Result<Vec<Stmt>, TocErr> {
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

    fn parse(&mut self) -> Result<Vec<Stmt>, TocErr> {
        let mut result: Vec<Stmt> = Vec::new();
        while !self.is_end() {
            result.push(self.parse_declaration()?)
        }
        Ok(result)
    }

    fn parse_declaration(&mut self) -> Result<Stmt, TocErr> {
        if self.match_keyword(&[Keyword::Var]) {
            self.parse_var_declaration()
        } else if self.match_keyword(&[Keyword::Fun]) {
            self.parse_fun_declaration()
        } else {
            self.parse_stmt()
        }
    }

    fn parse_fun_declaration(&mut self) -> Result<Stmt, TocErr> {
        let fun_keyword = self.get_keyword(&Keyword::Fun).unwrap();

        let name = self.get_identifier("Expect function name.")?;

        self.expect_symbol(&[Symbol::LeftParen], "Expect '(' after function name.")?;
        let mut parameters: Vec<Token> = Vec::new();
        if self.match_symbol(&[Symbol::RightParen]) {
            self.shift(); // Consume ')'
        } else {
            parameters = self.parameters()?;
            self.expect_symbol(
                &[Symbol::RightParen],
                "Expect ')' after function parameters.",
            )?;
        }
        if !self.match_symbol(&[Symbol::LeftBrace]) {
            return Err(TocErr::new(
                TocErrKind::ParseFail,
                "Expect '{' before function body.",
            ));
        }

        let body = Box::new(self.parse_block_stmt()?);

        Ok(Stmt::FunStmt(FunStmt {
            fun_keyword,
            name,
            parameters,
            body,
        }))
    }

    fn parameters(&mut self) -> Result<Vec<Token>, TocErr> {
        let mut params: Vec<Token> = Vec::new();
        loop {
            let param = self.get_identifier("Expect parameter name.")?;
            params.push(param);
            if self.match_symbol(&[Symbol::Comma]) {
                self.shift();
            } else {
                break;
            }
        }
        Ok(params)
    }

    fn parse_var_declaration(&mut self) -> Result<Stmt, TocErr> {
        let var_keyword = self.get_keyword(&Keyword::Var).unwrap();

        let var_name = self.get_identifier("Expect var name.")?;
        let mut initializer: Option<Expr> = None;
        if let Some(_) = self.get_symbol(&[Symbol::Assign]) {
            initializer = Some(self.parse_expr()?);
        }
        self.expect_symbol(&[Symbol::Semicolon], "Expect ';' after expression.")?;
        Ok(Stmt::VarStmt(VarStmt {
            var_keyword,
            var_name,
            initializer,
        }))
    }

    fn parse_stmt(&mut self) -> Result<Stmt, TocErr> {
        if self.match_symbol(&[Symbol::LeftBrace]) {
            return self.parse_block_stmt();
        } else if self.match_keyword(&[Keyword::If]) {
            return self.parse_if_stmt();
        } else if self.match_keyword(&[Keyword::For]) {
            return self.parse_for_stmt();
        }
        self.parse_expr_stmt()
    }

    fn parse_for_stmt(&mut self) -> Result<Stmt, TocErr> {
        let for_keyword = self.get_keyword(&Keyword::For).unwrap();

        self.expect_symbol(&[Symbol::LeftParen], "Expect '(' after for keyword.")?;

        let initializer: Option<Box<Stmt>>;
        if self.match_symbol(&[Symbol::Semicolon]) {
            initializer = None;
            self.shift(); // consume ';'
        } else if self.match_keyword(&[Keyword::Var]) {
            initializer = Some(Box::new(self.parse_var_declaration()?));
        } else {
            initializer = Some(Box::new(self.parse_expr_stmt()?));
        }

        let mut condition: Option<Expr> = None;
        if self.get_symbol(&[Symbol::Semicolon]).is_none() {
            condition = Some(self.parse_expr()?);
            self.expect_symbol(&[Symbol::Semicolon], "Expect ';' after for condition.")?;
        }

        let mut increment: Option<Expr> = None;
        if self.get_symbol(&[Symbol::RightParen]).is_none() {
            increment = Some(self.parse_expr()?);
            self.expect_symbol(&[Symbol::RightParen], "Expect ')' after for condition.")?;
        }

        let body = Box::new(self.parse_stmt()?);
        Ok(Stmt::ForStmt(ForStmt {
            for_keyword,
            initializer,
            condition,
            increment,
            body,
        }))
    }

    fn parse_if_stmt(&mut self) -> Result<Stmt, TocErr> {
        let if_keyword = self.get_keyword(&Keyword::If).unwrap();

        self.expect_symbol(&[Symbol::LeftParen], "Expect '(' before if condition.")?;
        let condition = self.parse_expr()?;
        self.expect_symbol(&[Symbol::RightParen], "Expect ')' after if condition.")?;
        let if_clause = Box::new(self.parse_stmt()?);
        let mut else_clause = None;
        if let Some(_) = self.get_keyword(&Keyword::Else) {
            else_clause = Some(Box::new(self.parse_stmt()?));
        }
        Ok(Stmt::IfStmt(IfStmt {
            if_keyword,
            condition,
            if_clause,
            else_clause,
        }))
    }

    fn parse_block_stmt(&mut self) -> Result<Stmt, TocErr> {
        let left_brace = self.get_symbol(&[Symbol::LeftBrace]).unwrap();

        let mut stmts: Vec<Stmt> = Vec::new();
        while !self.is_end() && !self.current().is_symbol(&Symbol::RightBrace) {
            stmts.push(self.parse_declaration()?);
        }

        if self.is_end() {
            return Err(TocErr::new(
                TocErrKind::ParseFail,
                "Expect '}' end the block.",
            ));
        }

        // Consume '}'.
        self.get_symbol(&[Symbol::RightBrace]).unwrap();

        Ok(Stmt::BlockStmt(BlockStmt { left_brace, stmts }))
    }

    fn parse_expr_stmt(&mut self) -> Result<Stmt, TocErr> {
        let expr = self.parse_expr()?;
        self.expect_symbol(&[Symbol::Semicolon], "Expect ';' after expression.")?;
        Ok(Stmt::ExprStmt(ExprStmt { expr }))
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
    // primary:     literal 'identifier' ()

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
                    &format!("Invalid assignment target before {}.", assign),
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
        while let Some(token) = self.get_symbol(&[Symbol::Equal, Symbol::NotEqual]) {
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
        while let Some(token) = self.get_symbol(&[Symbol::Star, Symbol::Slash, Symbol::Percent]) {
            let left = Box::new(expr);
            let op = token;
            let right = Box::new(self.parse_unary_expr()?);
            expr = Binary(BinaryExpr { left, op, right });
        }
        Ok(expr)
    }

    fn parse_unary_expr(&mut self) -> Result<Expr, TocErr> {
        if let Some(token) = self.get_symbol(&[Symbol::Bang]) {
            let op = token;
            let right = Box::new(self.parse_unary_expr()?);
            return Ok(Unary(UnaryExpr { op, expr: right }));
        }
        Ok(self.parse_call_expr()?)
    }

    fn parse_call_expr(&mut self) -> Result<Expr, TocErr> {
        let mut expr = self.parse_primary()?;
        while let Some(token) = self.get_symbol(&[Symbol::LeftParen]) {
            let callee = Box::new(expr);
            let left_paren = token;
            let mut args: Vec<Expr> = Vec::new();
            if let None = self.get_symbol(&[Symbol::RightParen]) {
                args = self.parse_arguments()?;
                self.expect_symbol(&[Symbol::RightParen], "Expect ')' end fun call.")?;
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
            if let None = self.get_symbol(&[Symbol::Comma]) {
                break;
            }
        }
        Ok(args)
    }

    fn parse_primary(&mut self) -> Result<Expr, TocErr> {
        if self.is_end() {
            return Err(TocErr::new(
                TocErrKind::ParseFail,
                "Expect expression, but got end.",
            ));
        }

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
                self.expect_symbol(&[Symbol::RightParen], "Expect ')' after expression")?;
                Ok(Group(GroupExpr {
                    left_paren: token,
                    expr: Box::new(expr),
                }))
            }
            _ => Err(TocErr::new(
                TocErrKind::ParseFail,
                &format!("Expect expression, but got token {}.", token),
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

    fn match_symbol(&mut self, symbols: &[Symbol]) -> bool {
        if self.is_end() {
            return false;
        }

        let t = self.current();
        symbols.iter().any(|s| t.is_symbol(s))
    }

    fn match_keyword(&mut self, keywords: &[Keyword]) -> bool {
        if self.is_end() {
            return false;
        }

        let t = self.current();
        keywords.iter().any(|k| t.is_keyword(k))
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

    fn get_keyword(&mut self, keyword: &Keyword) -> Option<Token> {
        if self.is_end() {
            return None;
        }

        match self.current() {
            Token::Keyword(k, _) if k == keyword => Some(self.shift()),
            _ => None,
        }
    }

    fn get_identifier(&mut self, msg: &str) -> Result<Token, TocErr> {
        self.ensure_not_end(msg)?;

        let token = self.current();
        if let Token::Identifier(_, _) = token {
            Ok(self.shift())
        } else {
            Err(self.unexpect_token_err(token, msg))
        }
    }

    fn expect_symbol(&mut self, symbols: &[Symbol], msg: &str) -> Result<(), TocErr> {
        self.ensure_not_end(msg)?;

        let token = self.current();
        if let Token::Symbol(s, _) = token {
            if symbols.contains(&s) {
                self.shift();
                return Ok(());
            }
        }

        Err(self.unexpect_token_err(token, msg))
    }

    fn ensure_not_end(&self, msg: &str) -> Result<(), TocErr> {
        if self.is_end() {
            return Err(TocErr::new(
                TocErrKind::ParseFail,
                &format!("{} but got end.", msg),
            ));
        }

        Ok(())
    }

    fn unexpect_token_err(&self, token: &Token, msg: &str) -> TocErr {
        TocErr::new(
            TocErrKind::ParseFail,
            &format!("{} but got {}.", msg, token),
        )
    }
}

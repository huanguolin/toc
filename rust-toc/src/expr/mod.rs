pub mod expr_visitor;

use std::{fmt::Display};

use crate::{token::Token, s_expr_printer::SExprPinter};

use self::expr_visitor::ExprVisitor;

#[derive(Debug, Clone)]
pub enum Expr {
    Assign(AssignExpr),
    Binary(BinaryExpr),
    Group(GroupExpr),
    Unary(UnaryExpr),
    Literal(LiteralExpr),
    Variable(VariableExpr),
    Call(CallExpr),
}

#[derive(Debug, Clone)]
pub struct AssignExpr {
    pub var_name: Token,
    pub right: Box<Expr>,
}

#[derive(Debug, Clone)]
pub struct BinaryExpr {
    pub left: Box<Expr>,
    pub op: Token,
    pub right: Box<Expr>,
}

#[derive(Debug, Clone)]
pub struct GroupExpr {
    pub left_paren: Token,
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone)]
pub struct UnaryExpr {
    pub op: Token,
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone)]
pub enum LiteralExpr {
    String(String, Token),
    Number(u32, Token),
    Bool(bool, Token),
    Null(Token),
}

#[derive(Debug, Clone)]
pub struct VariableExpr {
    pub var_name: Token,
}

#[derive(Debug, Clone)]
pub struct CallExpr {
    pub callee: Box<Expr>,
    pub left_paren: Token,
    pub args: Vec<Expr>,
}

impl Expr {
    pub fn accept<R>(&self, visitor: &impl ExprVisitor<R>) -> R {
        match self {
            Expr::Assign(expr) => visitor.visit_assign_expr(expr),
            Expr::Binary(expr) => visitor.visit_binary_expr(expr),
            Expr::Group(expr) => visitor.visit_group_expr(expr),
            Expr::Unary(expr) => visitor.visit_unary_expr(expr),
            Expr::Literal(expr) => visitor.visit_literal_expr(expr),
            Expr::Variable(expr) => visitor.visit_variable_expr(expr),
            Expr::Call(expr) => visitor.visit_call_expr(expr),
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", SExprPinter::new().print_expr(self))
    }
}

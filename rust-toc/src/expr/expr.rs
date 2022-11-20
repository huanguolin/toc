use crate::token::Token;

use super::expr_visitor::ExprVisitor;

#[derive(Debug)]
pub enum Expr {
    Assign(AssignExpr),
    Binary(BinaryExpr),
    Group(GroupExpr),
    Unary(UnaryExpr),
    Literal(LiteralExpr),
    Variable(VariableExpr),
    Call(CallExpr),
}

#[derive(Debug)]
pub struct AssignExpr {
    pub ver_name: Token,
    pub right: Box<Expr>,
}

#[derive(Debug)]
pub struct BinaryExpr {
    pub left: Box<Expr>,
    pub op: Token,
    pub right: Box<Expr>,
}

#[derive(Debug)]
pub struct GroupExpr {
    pub expr: Box<Expr>,
}

#[derive(Debug)]
pub struct UnaryExpr {
    pub op: Token,
    pub expr: Box<Expr>,
}

#[derive(Debug)]
pub enum LiteralExpr {
    String(String),
    Number(u32),
    Bool(bool),
}

#[derive(Debug)]
pub struct VariableExpr {
    pub var_name: Token,
}

#[derive(Debug)]
pub struct CallExpr {
    pub callee: Box<Expr>,
    args: Vec<Expr>,
}

impl Expr {
    pub fn accept<R>(&self, visitor: impl ExprVisitor<R>) -> R {
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

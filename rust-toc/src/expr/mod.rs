
pub mod expr_visitor;

use std::fmt::Display;

use crate::token::Token;
use expr_visitor::ExprVisitor;

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
    pub var_name: Token,
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
    pub left_paren: Token,
    pub expr: Box<Expr>,
}

#[derive(Debug)]
pub struct UnaryExpr {
    pub op: Token,
    pub expr: Box<Expr>,
}

#[derive(Debug)]
pub enum LiteralExpr {
    String(String, Token),
    Number(u32, Token),
    Bool(bool, Token),
    Null(Token),
}

#[derive(Debug)]
pub struct VariableExpr {
    pub var_name: Token,
}

#[derive(Debug)]
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
        write!(f, "{}", SExprPinter::new().print(self))
    }
}


/**
 * S-expr printer.
 */
struct SExprPinter { }

impl SExprPinter {
    fn new() -> Self {
        SExprPinter { }
    }

    fn print(&self, expr: &Expr) -> String {
        expr.accept(self)
    }
}

impl ExprVisitor<String> for SExprPinter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> String {
        format!("( = {} {})", expr.var_name.to_str(), expr.right.accept(self))
    }

    fn visit_binary_expr(&self, expr: &BinaryExpr) -> String {
        format!("({} {} {})", expr.op.to_str(), expr.left.accept(self), expr.right.accept(self))
    }

    fn visit_group_expr(&self, expr: &GroupExpr) -> String {
        format!("({})", expr.expr.accept(self))
    }

    fn visit_unary_expr(&self, expr: &UnaryExpr) -> String {
        format!("({} {})", expr.op.to_str(), expr.expr.accept(self))
    }

    fn visit_literal_expr(&self, expr: &LiteralExpr) -> String {
        match expr {
            LiteralExpr::String(s, _) => format!("{}", s),
            LiteralExpr::Number(n, _) => format!("{}", n),
            LiteralExpr::Bool(b, _) => format!("{}", b),
            LiteralExpr::Null(_) => format!("null"),
        }
    }

    fn visit_variable_expr(&self, expr: &VariableExpr) -> String {
        format!("{}", expr.var_name.to_str())
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> String {
        let callee = expr.callee.accept(self);
        let args = (&expr.args)
            .into_iter()
            .fold(String::new(), |a, b| format!("{} {}", a, &b.accept(self)));
        format!("({} {})", callee, args)
    }
}

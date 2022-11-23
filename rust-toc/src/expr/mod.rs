pub mod expr_visitor;

use std::{fmt::Display, cell::Cell};
use colored::{Colorize, Color::{self, *}};

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
struct SExprPinter {
    colors: Vec<Color>,
    depth: Cell<usize>,
}

impl SExprPinter {
    fn new() -> Self {
        SExprPinter {
            colors: vec![Blue, Yellow, Green, BrightYellow],
            depth: Cell::new(0),
        }
    }

    fn print(&self, expr: &Expr) -> String {
        expr.accept(self)
            .into_iter()
            .fold(String::new(), |a, b| a + "\n" + &b)
            .trim_start()
            .to_string()
    }

    fn depth(&self) -> usize {
        self.depth.get()
    }

    fn inc_depth(&self) {
        let d = self.depth.get();
        let n = (d + 1) % usize::MAX;
        self.depth.set(n);
    }

    fn advance_color(&self) -> Color {
        let color = self.colors[self.depth() % self.colors.len()];
        self.inc_depth();
        color
    }

    fn indent(&self, s: String) -> String {
        // 4 space
        format!("    {}", s)
    }

    fn wrap_s_expr(&self, mut res: Vec<String>) -> Vec<String> {
        let len = res.len();

        if len == 0 {
            panic!("wrap_s_expr() 'res.len()' can not be zero.");
        }

        let color = self.advance_color();
        for i in 0..len {
            let mut s = res[i].clone();

            if i == 0 {
                s = format!("{}{}", "(".color(color), s);
            }

            if i == len - 1 {
                s = format!("{}{}", s, ")".color(color));
            }

            if i == 0 {
                res[i] = s; // The first one not need indent, other do.
            } else {
                res[i] = self.indent(s);
            }
        }

        res
    }
}

impl ExprVisitor<Vec<String>> for SExprPinter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("=".to_owned());
        res.push(self.indent(expr.var_name.to_str()));
        res.extend(expr.right.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_binary_expr(&self, expr: &BinaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push(expr.op.to_str());
        res.extend(expr.left.accept(self));
        res.extend(expr.right.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_group_expr(&self, expr: &GroupExpr) -> Vec<String> {
        expr.expr.accept(self)
    }

    fn visit_unary_expr(&self, expr: &UnaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push(expr.op.to_str());
        res.extend(expr.expr.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_literal_expr(&self, expr: &LiteralExpr) -> Vec<String> {
        let s = match expr {
            LiteralExpr::String(s, _) => format!("{}", s),
            LiteralExpr::Number(n, _) => format!("{}", n),
            LiteralExpr::Bool(b, _) => format!("{}", b),
            LiteralExpr::Null(_) => format!("null"),
        };
        vec![s]
    }

    fn visit_variable_expr(&self, expr: &VariableExpr) -> Vec<String> {
        vec![expr.var_name.to_str()]
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.extend(expr.callee.accept(self));
        if expr.args.len() > 0 {
            for i in 0..expr.args.len() - 1 {
                res.extend(expr.args[i].accept(self));
            }
        }

        self.wrap_s_expr(res)
    }
}

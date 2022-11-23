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
struct SExprPinter {}

impl SExprPinter {
    fn new() -> Self {
        SExprPinter {}
    }

    fn print(&self, expr: &Expr) -> String {
        expr.accept(self)
            .into_iter()
            .fold(String::new(), |a, b| a + "\n" + &b)
            .trim_start()
            .to_string()
    }

    fn indent(&self, s: String) -> String {
        // 4 space
        format!("    {}", s)
    }

    fn indents(&self, res: &mut Vec<String>, expr: &Expr) {
        for s in expr.accept(self) {
            res.push(self.indent(s));
        }
    }

    fn indents_with_start(&self, res: &mut Vec<String>, expr: &Expr) {
        let ss = expr.accept(self);
        for (i, s) in ss.into_iter().enumerate() {
            if i == 0 {
                res.push(format!("({}", s));
            } else {
                res.push(self.indent(s));
            }
        }
    }

    fn indents_with_end(&self, res: &mut Vec<String>, expr: &Expr) {let ss = expr.accept(self);
        let len = ss.len();
        for (i, s) in ss.into_iter().enumerate() {
            let mut is = self.indent(s);
            if i == len - 1 {
                is += ")"
            }
            res.push(is);
        }
    }

    fn indents_paired(&self, res: &mut Vec<String>, expr: &Expr) {
        let ss = expr.accept(self);
        let len = ss.len();
        for (i, s) in ss.into_iter().enumerate() {
            let mut is = s.clone();

            if i == 0 {
                is = format!("({}", s);
            }

            if i == len - 1 {
                is += ")";
            }

            if i == 0 {
                res.push(is);
            } else {
                res.push(self.indent(is));
            }
        }
    }
}

impl ExprVisitor<Vec<String>> for SExprPinter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();
        res.push("(=".to_owned());
        res.push(self.indent(expr.var_name.to_str()));
        self.indents_with_end(&mut res, &expr.right);
        res
    }

    fn visit_binary_expr(&self, expr: &BinaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();
        res.push(format!("({}", expr.op.to_str()));
        self.indents(&mut res, &expr.left);
        self.indents_with_end(&mut res, &expr.right);
        res
    }

    fn visit_group_expr(&self, expr: &GroupExpr) -> Vec<String> {
        expr.expr.accept(self)
    }

    fn visit_unary_expr(&self, expr: &UnaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();
        res.push(format!("({}", expr.op.to_str()));
        self.indents_with_end(&mut res, &expr.expr);
        res
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

        if expr.args.len() > 0 {
            self.indents_with_start(&mut res, &expr.callee);

            for i in 0..expr.args.len() - 1 {
                self.indents(&mut res, &expr.args[i]);
            }
            self.indents_with_end(&mut res, expr.args.last().unwrap());
        } else {
            self.indents_paired(&mut res, &expr.callee);
        }

        res
    }
}

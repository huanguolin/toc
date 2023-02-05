use std::cell::Cell;

use colored::{
    Color::{self, *},
    Colorize,
};

use crate::{expr::{
    expr_visitor::ExprVisitor, AssignExpr, BinaryExpr, CallExpr, Expr, GroupExpr, LiteralExpr,
    UnaryExpr, VariableExpr,
}, stmt::{Stmt, stmt_visitor::StmtVisitor}, token::Token};

/**
 * S-expr printer.
 */
pub struct SExprPinter {
    colors: Vec<Color>,
    depth: Cell<usize>,
}

impl SExprPinter {
    pub fn new() -> Self {
        SExprPinter {
            colors: vec![Red, Green, Yellow, Blue, Magenta, Cyan, White],
            depth: Cell::new(0),
        }
    }

    pub fn print_expr(&self, expr: &Expr) -> String {
        expr.accept(self)
            .into_iter()
            .fold(String::new(), |a, b| a + "\n" + &b)
            .trim_start()
            .to_string()
    }

    pub fn print_stmt(&self, stmt: &Stmt) -> String {
        stmt.accept(self)
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

    fn fmt_fun_parameters(&self, parameters: &Vec<Token>) -> String {
        let ps = parameters
            .iter()
            .map(|p| p.lexeme())
            .collect::<Vec<_>>();
        "(".to_owned() + &ps.join(" ") + ")"
    }
}

impl StmtVisitor<Vec<String>> for SExprPinter {
    fn visit_expr_stmt(&self, stmt: &crate::stmt::ExprStmt) -> Vec<String> {
        stmt.expr.accept(self)
    }

    fn visit_var_stmt(&self, stmt: &crate::stmt::VarStmt) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("var".to_owned());
        res.push(stmt.var_name.lexeme());
        if let Some(init) = &stmt.initializer {
            res.extend(init.accept(self));
        }

        self.wrap_s_expr(res)
    }

    fn visit_block_stmt(&self, stmt: &crate::stmt::BlockStmt) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("block".to_owned());
        for s in &stmt.stmts {
            res.extend(s.accept(self));
        }

        self.wrap_s_expr(res)
    }

    fn visit_if_stmt(&self, stmt: &crate::stmt::IfStmt) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("if".to_owned());
        res.extend(stmt.if_clause.accept(self));
        if let Some(else_clause) = &stmt.else_clause {
            res.extend(else_clause.accept(self));
        }

        self.wrap_s_expr(res)
    }

    fn visit_for_stmt(&self, stmt: &crate::stmt::ForStmt) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("for".to_owned());

        if let Some(init) = &stmt.initializer {
            res.extend(init.accept(self));
        } else {
            res.push("()".to_owned());
        }

        if let Some(cond) = &stmt.condition {
            res.extend(cond.accept(self));
        } else {
            res.push("()".to_owned());
        }

        if let Some(inc) = &stmt.increment {
            res.extend(inc.accept(self));
        } else {
            res.push("()".to_owned());
        }

        res.extend(stmt.body.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_fun_stmt(&self, stmt: &crate::stmt::FunStmt) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("fun".to_owned());
        res.push(stmt.name.lexeme());
        res.push(self.fmt_fun_parameters(&stmt.parameters));
        res.extend(stmt.body.accept(self));

        self.wrap_s_expr(res)
    }
}

impl ExprVisitor<Vec<String>> for SExprPinter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push("=".to_owned());
        res.push(expr.var_name.lexeme());
        res.extend(expr.right.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_binary_expr(&self, expr: &BinaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push(expr.op.lexeme());
        res.extend(expr.left.accept(self));
        res.extend(expr.right.accept(self));

        self.wrap_s_expr(res)
    }

    fn visit_group_expr(&self, expr: &GroupExpr) -> Vec<String> {
        expr.expr.accept(self)
    }

    fn visit_unary_expr(&self, expr: &UnaryExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.push(expr.op.lexeme());
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
        vec![expr.var_name.lexeme()]
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> Vec<String> {
        let mut res: Vec<String> = Vec::new();

        res.extend(expr.callee.accept(self));
        if expr.args.len() > 0 {
            for i in 0..expr.args.len() {
                res.extend(expr.args[i].accept(self));
            }
        }

        self.wrap_s_expr(res)
    }
}

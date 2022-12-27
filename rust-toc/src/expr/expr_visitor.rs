use super::{AssignExpr, BinaryExpr, GroupExpr, UnaryExpr, LiteralExpr, VariableExpr, CallExpr};

pub trait ExprVisitor<T> {
    fn visit_assign_expr(&mut self, expr: &AssignExpr) -> T;
    fn visit_binary_expr(&mut self, expr: &BinaryExpr) -> T;
    fn visit_group_expr(&mut self, expr: &GroupExpr) -> T;
    fn visit_unary_expr(&mut self, expr: &UnaryExpr) -> T;
    fn visit_literal_expr(&mut self, expr: &LiteralExpr) -> T;
    fn visit_variable_expr(&mut self, expr: &VariableExpr) -> T;
    fn visit_call_expr(&mut self, expr: &CallExpr) -> T;
}
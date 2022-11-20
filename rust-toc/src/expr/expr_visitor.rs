use super::expr::{AssignExpr, BinaryExpr, GroupExpr, UnaryExpr, LiteralExpr, VariableExpr, CallExpr};

pub trait ExprVisitor<T> {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> T;
    fn visit_binary_expr(&self, expr: &BinaryExpr) -> T;
    fn visit_group_expr(&self, expr: &GroupExpr) -> T;
    fn visit_unary_expr(&self, expr: &UnaryExpr) -> T;
    fn visit_literal_expr(&self, expr: &LiteralExpr) -> T;
    fn visit_variable_expr(&self, expr: &VariableExpr) -> T;
    fn visit_call_expr(&self, expr: &CallExpr) -> T;
}
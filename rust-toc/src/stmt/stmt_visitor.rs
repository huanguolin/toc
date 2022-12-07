use super::{ExprStmt, VarStmt, BlockStmt, IfStmt, ForStmt, FnStmt};

pub trait StmtVisitor<T> {
    fn visit_expr_stmt(&self, expr: &ExprStmt) -> T;
    fn visit_var_stmt(&self, expr: &VarStmt) -> T;
    fn visit_block_stmt(&self, expr: &BlockStmt) -> T;
    fn visit_if_stmt(&self, expr: &IfStmt) -> T;
    fn visit_for_stmt(&self, expr: &ForStmt) -> T;
    fn visit_fn_stmt(&self, expr: &FnStmt) -> T;
}
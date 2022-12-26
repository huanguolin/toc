use super::{ExprStmt, VarStmt, BlockStmt, IfStmt, ForStmt, FnStmt};

pub trait StmtVisitor<T> {
    fn visit_expr_stmt(&self, stmt: &ExprStmt) -> T;
    fn visit_var_stmt(&mut self, stmt: &VarStmt) -> T;
    fn visit_block_stmt(&self, stmt: &BlockStmt) -> T;
    fn visit_if_stmt(&self, stmt: &IfStmt) -> T;
    fn visit_for_stmt(&self, stmt: &ForStmt) -> T;
    fn visit_fn_stmt(&self, stmt: &FnStmt) -> T;
}
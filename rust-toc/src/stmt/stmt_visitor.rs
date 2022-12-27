use super::{ExprStmt, VarStmt, BlockStmt, IfStmt, ForStmt, FnStmt};

pub trait StmtVisitor<T> {
    fn visit_expr_stmt(&mut self, stmt: &ExprStmt) -> T;
    fn visit_var_stmt(&mut self, stmt: &VarStmt) -> T;
    fn visit_block_stmt(&mut self, stmt: &BlockStmt) -> T;
    fn visit_if_stmt(&mut self, stmt: &IfStmt) -> T;
    fn visit_for_stmt(&mut self, stmt: &ForStmt) -> T;
    fn visit_fn_stmt(&mut self, stmt: &FnStmt) -> T;
}
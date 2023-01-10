use super::{ExprStmt, VarStmt, BlockStmt, IfStmt, ForStmt, FunStmt};

pub trait StmtVisitor<T> {
    fn visit_expr_stmt(&self, stmt: &ExprStmt) -> T;
    fn visit_var_stmt(&self, stmt: &VarStmt) -> T;
    fn visit_block_stmt(&self, stmt: &BlockStmt) -> T;
    fn visit_if_stmt(&self, stmt: &IfStmt) -> T;
    fn visit_for_stmt(&self, stmt: &ForStmt) -> T;
    fn visit_fun_stmt(&self, stmt: &FunStmt) -> T;
}
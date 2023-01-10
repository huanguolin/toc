use crate::{expr::Expr, token::Token};

use self::stmt_visitor::StmtVisitor;

pub mod stmt_visitor;

#[derive(Debug)]
pub enum Stmt {
    ExprStmt(ExprStmt),
    VarStmt(VarStmt),
    BlockStmt(BlockStmt),
    IfStmt(IfStmt),
    ForStmt(ForStmt),
    FunStmt(FunStmt),
}

#[derive(Debug)]
pub struct ExprStmt {
    pub expr: Expr,
}

#[derive(Debug)]
pub struct VarStmt {
    pub var_keyword: Token,
    pub var_name: Token,
    pub initializer: Option<Expr>,
}

#[derive(Debug)]
pub struct BlockStmt {
    pub left_brace: Token,
    pub stmts: Vec<Stmt>,
}

#[derive(Debug)]
pub struct IfStmt {
    pub if_keyword: Token,
    pub condition: Expr,
    pub if_clause: Box<Stmt>,
    pub else_clause: Option<Box<Stmt>>,
}

#[derive(Debug)]
pub struct ForStmt {
    pub for_keyword: Token,
    pub initializer: Option<Box<Stmt>>,
    pub condition: Option<Expr>,
    pub increment: Option<Expr>,
    pub body: Box<Stmt>,
}

#[derive(Debug)]
pub struct FunStmt {
    pub fun_keyword: Token,
    pub name: Token,
    pub parameters: Vec<Token>,
    pub body: Box<Stmt>,
}

impl Stmt {
    pub fn accept<R>(&self, visitor: &impl StmtVisitor<R>) -> R {
        match self {
            Self::ExprStmt(stmt) => visitor.visit_expr_stmt(stmt),
            Self::VarStmt(stmt) => visitor.visit_var_stmt(stmt),
            Self::BlockStmt(stmt) => visitor.visit_block_stmt(stmt),
            Self::IfStmt(stmt) => visitor.visit_if_stmt(stmt),
            Self::ForStmt(stmt) => visitor.visit_for_stmt(stmt),
            Self::FunStmt(stmt) => visitor.visit_fun_stmt(stmt),
        }
    }
}
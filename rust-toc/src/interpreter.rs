use std::{mem::{swap, self}, cell::Cell};

use crate::{
    error::{TocErr, TocErrKind},
    expr::{expr_visitor::ExprVisitor, *},
    stmt::{stmt_visitor::StmtVisitor, *},
    toc_result::TocResult,
    token::{symbol::Symbol, Token}, env::Env,
};

pub struct Interpreter {
    env: Cell<Env>,
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            env: Cell::new(Env::new(None))
        }
    }

    pub fn interpret(&mut self, stmts: Vec<Stmt>) -> Result<TocResult, TocErr> {
        let mut last_result: TocResult = TocResult::Null;
        for stmt in stmts {
            last_result = stmt.accept(self)?;
        }
        Ok(last_result)
    }

    fn execute_block(&mut self, block_stmt: &BlockStmt, env: Env) -> Result<TocResult, TocErr> {
        self.env.replace(env);

        let mut last_result: TocResult = TocResult::Null;
        let mut err: Option<TocErr> = None;
        for stmt in &block_stmt.stmts {
            match stmt.accept(self) {
                Err(e) => {
                    err = Some(e);
                    break;
                },
                Ok(r) => {
                    last_result = r;
                }
            }
        }

        let outer = self.env.get_mut().outer.replace(None);
        self.env.replace(outer.unwrap());

        if err.is_some() {
            Err(err.unwrap())
        } else {
            Ok(last_result)
        }
    }
}

impl StmtVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_expr_stmt(&mut self, stmt: &ExprStmt) -> Result<TocResult, TocErr> {
       stmt.expr.accept(self)
    }

    fn visit_var_stmt(&mut self, stmt: &VarStmt) -> Result<TocResult, TocErr> {
        let mut initializer = TocResult::Null;
        if stmt.initializer.is_some() {
            initializer = stmt.initializer.as_ref().unwrap().accept(self)?;
        }
        self.env.get_mut().define(&stmt.var_name, initializer.clone())?;
        Ok(initializer)
    }

    fn visit_block_stmt(&mut self, stmt: &BlockStmt) -> Result<TocResult, TocErr> {
       self.execute_block(stmt, Env::new(Some(self.env.replace(Env::new(None)))))
    }

    fn visit_if_stmt(&mut self, stmt: &IfStmt) -> Result<TocResult, TocErr> {
        todo!()
    }

    fn visit_for_stmt(&mut self, stmt: &ForStmt) -> Result<TocResult, TocErr> {
        todo!()
    }

    fn visit_fn_stmt(&mut self, stmt: &FnStmt) -> Result<TocResult, TocErr> {
        todo!()
    }
}

impl ExprVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_assign_expr(&mut self, expr: &AssignExpr) -> Result<TocResult, TocErr> {
        let v = expr.right.accept(self)?;
        self.env.get_mut().assign(&expr.var_name, v.clone())?;
        Ok(v)
    }

    fn visit_binary_expr(&mut self, expr: &BinaryExpr) -> Result<TocResult, TocErr> {
        let lv = expr.left.accept(self)?;

        if let Token::Symbol(sym, _) = &expr.op {
            if *sym == Symbol::And {
                Ok(if lv.is_true() {
                    expr.right.accept(self)?
                } else {
                    lv
                })
            } else if *sym == Symbol::Or {
                Ok(if lv.is_false() {
                    expr.right.accept(self)?
                } else {
                    lv
                })
            } else {
                let rv = expr.right.accept(self)?;
                match sym {
                    Symbol::Plus => lv + rv,
                    Symbol::Equal => Ok(TocResult::Bool(lv == rv)),
                    Symbol::NotEqual => Ok(TocResult::Bool(lv != rv)),
                    _ => {
                        if let (TocResult::Number(l), TocResult::Number(r)) = (lv, rv) {
                            match sym {
                                Symbol::Minus => {
                                    Ok(TocResult::Number(if l > r { l - r } else { 0 }))
                                }
                                Symbol::Star => Ok(TocResult::Number(l * r)),
                                Symbol::Slash => Ok(TocResult::Number(l / r)),
                                Symbol::Percent => Ok(TocResult::Number(l % r)),
                                Symbol::Greater => Ok(TocResult::Bool(l > r)),
                                Symbol::Less => Ok(TocResult::Bool(l < r)),
                                Symbol::GreaterEqual => Ok(TocResult::Bool(l >= r)),
                                Symbol::LessEqual => Ok(TocResult::Bool(l <= r)),
                                _ => Err(TocErr::new(
                                    TocErrKind::RuntimeError,
                                    format!("Unknown binary operator {}.", expr.op),
                                )),
                            }
                        } else {
                            Err(TocErr::new(
                                TocErrKind::RuntimeError,
                                format!("Required both operand is number for operator {}, but got left is {} and right is {}.", expr.op, expr.left, expr.right),
                            ))
                        }
                    }
                }
            }
        } else {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                format!("Unknown binary operator {}.", expr.op),
            ))
        }
    }

    fn visit_group_expr(&mut self, expr: &GroupExpr) -> Result<TocResult, TocErr> {
        expr.expr.accept(self)
    }

    fn visit_unary_expr(&mut self, expr: &UnaryExpr) -> Result<TocResult, TocErr> {
        let v = expr.expr.accept(self)?;
        if let Token::Symbol(Symbol::Bang, _) = &expr.op {
            Ok(TocResult::Bool(v.is_false()))
        } else {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                format!("Unknown unary operator {}.", expr.op),
            ))
        }
    }

    fn visit_literal_expr(&mut self, expr: &LiteralExpr) -> Result<TocResult, TocErr> {
        Ok(TocResult::from(expr))
    }

    fn visit_variable_expr(&mut self, expr: &VariableExpr) -> Result<TocResult, TocErr> {
        self.env.get_mut().get(&expr.var_name)
    }

    fn visit_call_expr(&mut self, expr: &CallExpr) -> Result<TocResult, TocErr> {
        todo!()
    }
}

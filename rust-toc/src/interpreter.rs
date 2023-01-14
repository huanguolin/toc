use std::{cell::RefCell, rc::Rc};

use crate::{
    env::Env,
    error::{TocErr, TocErrKind},
    expr::{expr_visitor::ExprVisitor, *},
    fun_object::FunObject,
    stmt::{stmt_visitor::StmtVisitor, *},
    toc_result::TocResult,
    token::{symbol::Symbol, Token},
};

pub struct Interpreter {
    env: RefCell<Env>,
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            env: RefCell::new(Env::new(None)),
        }
    }

    pub fn interpret(&self, stmts: Vec<Stmt>) -> Result<TocResult, TocErr> {
        let mut last_result: TocResult = TocResult::Null;
        for stmt in stmts {
            last_result = stmt.accept(self)?;
        }
        Ok(last_result)
    }

    pub fn execute_block(&self, block_stmt: &BlockStmt, env: Env) -> Result<TocResult, TocErr> {
        self.push_env(env);

        let mut last_result: TocResult = TocResult::Null;
        let mut err: Option<TocErr> = None;
        for stmt in &block_stmt.stmts {
            match stmt.accept(self) {
                Err(e) => {
                    err = Some(e);
                    break;
                }
                Ok(r) => {
                    last_result = r;
                }
            }
        }

        self.pop_env();

        if err.is_some() {
            Err(err.unwrap())
        } else {
            Ok(last_result)
        }
    }

    fn push_env(&self, env: Env) {
        self.env.replace(env);
    }

    fn pop_env(&self) {
        let outer = self.env.borrow_mut().outer.replace(None);
        self.env.replace(outer.unwrap());
    }
}

impl StmtVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_expr_stmt(&self, stmt: &ExprStmt) -> Result<TocResult, TocErr> {
        stmt.expr.accept(self)
    }

    fn visit_var_stmt(&self, stmt: &VarStmt) -> Result<TocResult, TocErr> {
        let mut initializer = TocResult::Null;
        if stmt.initializer.is_some() {
            initializer = stmt.initializer.as_ref().unwrap().accept(self)?;
        }
        self.env
            .borrow_mut()
            .define(&stmt.var_name, initializer.clone())?;
        Ok(initializer)
    }

    fn visit_block_stmt(&self, stmt: &BlockStmt) -> Result<TocResult, TocErr> {
        self.execute_block(stmt, Env::new(Some(self.env.replace(Env::new(None)))))
    }

    fn visit_if_stmt(&self, stmt: &IfStmt) -> Result<TocResult, TocErr> {
        let cond = stmt.condition.accept(self)?;
        if cond.is_true() {
            stmt.if_clause.accept(self)
        } else if stmt.else_clause.is_some() {
            stmt.else_clause.as_ref().unwrap().accept(self)
        } else {
            Ok(TocResult::Null)
        }
    }

    fn visit_for_stmt(&self, stmt: &ForStmt) -> Result<TocResult, TocErr> {
        let prev_env = self.env.replace(Env::new(None));
        self.push_env(Env::new(Some(prev_env)));

        if stmt.initializer.is_some() {
            stmt.initializer.as_ref().unwrap().accept(self)?;
        }

        let mut condition_result: TocResult = TocResult::Bool(true);
        if stmt.condition.is_some() {
            condition_result = stmt.condition.as_ref().unwrap().accept(self)?;
        }

        let mut result: TocResult = TocResult::Null;
        while condition_result.is_true() {
            result = stmt.body.accept(self)?;
            if stmt.increment.is_some() {
                stmt.increment.as_ref().unwrap().accept(self)?;
            }
            if stmt.condition.is_some() {
                condition_result = stmt.condition.as_ref().unwrap().accept(self)?;
            }
        }

        self.pop_env();

        Ok(result)
    }

    fn visit_fun_stmt(&self, stmt: &FunStmt) -> Result<TocResult, TocErr> {
        let fun_name = &stmt.name;
        let fun_object = Rc::new(FunObject::new(stmt.to_owned()));
        self.env
            .borrow_mut()
            .define(fun_name, TocResult::Fun(Rc::clone(&fun_object)))?;
        Ok(TocResult::Fun(Rc::clone(&fun_object)))
    }
}

impl ExprVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> Result<TocResult, TocErr> {
        let v = expr.right.accept(self)?;
        self.env.borrow_mut().assign(&expr.var_name, v.clone())?;
        Ok(v)
    }

    fn visit_binary_expr(&self, expr: &BinaryExpr) -> Result<TocResult, TocErr> {
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
                                    &format!("Unknown binary operator {}.", expr.op),
                                )),
                            }
                        } else {
                            Err(TocErr::new(
                                TocErrKind::RuntimeError,
                                &format!("Required both operand is number for operator {}, but got left is {} and right is {}.", expr.op, expr.left, expr.right),
                            ))
                        }
                    }
                }
            }
        } else {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!("Unknown binary operator {}.", expr.op),
            ))
        }
    }

    fn visit_group_expr(&self, expr: &GroupExpr) -> Result<TocResult, TocErr> {
        expr.expr.accept(self)
    }

    fn visit_unary_expr(&self, expr: &UnaryExpr) -> Result<TocResult, TocErr> {
        let v = expr.expr.accept(self)?;
        if let Token::Symbol(Symbol::Bang, _) = &expr.op {
            Ok(TocResult::Bool(v.is_false()))
        } else {
            Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!("Unknown unary operator {}.", expr.op),
            ))
        }
    }

    fn visit_literal_expr(&self, expr: &LiteralExpr) -> Result<TocResult, TocErr> {
        Ok(TocResult::from(expr))
    }

    fn visit_variable_expr(&self, expr: &VariableExpr) -> Result<TocResult, TocErr> {
        self.env.borrow().get(&expr.var_name)
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> Result<TocResult, TocErr> {
        todo!()
    }
}

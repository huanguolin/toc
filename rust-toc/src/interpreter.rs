use crate::{
    error::{TocErr, TocErrKind},
    expr::{expr_visitor::ExprVisitor, *},
    stmt::{stmt_visitor::StmtVisitor, *},
    toc_result::TocResult,
    token::{symbol::Symbol, Token}, env::Env,
};

pub struct Interpreter {
    env: Env,
}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {
            env: Env::new(None)
        }
    }

    pub fn interpret(&mut self, stmts: Vec<Stmt>) -> Result<TocResult, TocErr> {
        let mut last_result: TocResult = TocResult::Null;
        for stmt in stmts {
            last_result = stmt.accept(self)?;
        }
        Ok(last_result)
    }
}

impl StmtVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_expr_stmt(&self, stmt: &ExprStmt) -> Result<TocResult, TocErr> {
       stmt.expr.accept(self)
    }

    fn visit_var_stmt(&mut self, stmt: &VarStmt) -> Result<TocResult, TocErr> {
        let mut initializer = TocResult::Null;
        if stmt.initializer.is_some() {
            initializer = stmt.initializer.as_ref().unwrap().accept(self)?;
        }
        self.env.define(&stmt.var_name, initializer.clone())?;
        Ok(initializer)
    }

    fn visit_block_stmt(&self, stmt: &BlockStmt) -> Result<TocResult, TocErr> {
        todo!()
    }

    fn visit_if_stmt(&self, stmt: &IfStmt) -> Result<TocResult, TocErr> {
        todo!()
    }

    fn visit_for_stmt(&self, stmt: &ForStmt) -> Result<TocResult, TocErr> {
        todo!()
    }

    fn visit_fn_stmt(&self, stmt: &FnStmt) -> Result<TocResult, TocErr> {
        todo!()
    }
}

impl ExprVisitor<Result<TocResult, TocErr>> for Interpreter {
    fn visit_assign_expr(&self, expr: &AssignExpr) -> Result<TocResult, TocErr> {
        todo!()
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
                format!("Unknown unary operator {}.", expr.op),
            ))
        }
    }

    fn visit_literal_expr(&self, expr: &LiteralExpr) -> Result<TocResult, TocErr> {
        Ok(TocResult::from(expr))
    }

    fn visit_variable_expr(&self, expr: &VariableExpr) -> Result<TocResult, TocErr> {
        self.env.get(&expr.var_name)
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> Result<TocResult, TocErr> {
        todo!()
    }
}

use crate::{
    error::{TocErr, TocErrKind},
    expr::{
        expr_visitor::ExprVisitor, AssignExpr, BinaryExpr, CallExpr, Expr, GroupExpr, LiteralExpr,
        UnaryExpr, VariableExpr,
    },
    toc_result::TocResult,
    token::{symbol::Symbol, Token},
};

pub struct Interpreter {}

impl Interpreter {
    pub fn new() -> Self {
        Interpreter {}
    }

    pub fn interpret(&self, expr: Expr) -> Result<TocResult, TocErr> {
        expr.accept(self)
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
                                Symbol::Minus => Ok(TocResult::Number(l - r)),
                                Symbol::Star => Ok(TocResult::Number(l * r)),
                                Symbol::Slash => Ok(TocResult::Number(l / r)),
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
        todo!()
    }

    fn visit_call_expr(&self, expr: &CallExpr) -> Result<TocResult, TocErr> {
        todo!()
    }
}

use std::{fmt::Display, ops, rc::Rc, any::type_name};

use crate::{error::{TocErr, TocErrKind}, expr::LiteralExpr, fun_object::FunObject};

#[derive(Clone)]
pub enum TocResult {
    Fun(Rc<FunObject>),
    String(String),
    Number(u32),
    Bool(bool),
    Null,
}

impl TocResult {
    pub fn from(le: &LiteralExpr) -> Self {
        match le {
            LiteralExpr::String(v, _) => Self::String(v.to_string()),
            LiteralExpr::Number(v, _) => Self::Number(*v),
            LiteralExpr::Bool(v, _) => Self::Bool(*v),
            LiteralExpr::Null(_) => Self::Null,
        }
    }

    pub fn is_true(&self) -> bool {
        match self {
            Self::Fun(_) => true,
            Self::String(s) => s.len() > 0,
            Self::Number(n) => *n != 0,
            Self::Bool(b) => *b,
            Self::Null => false,
        }
    }

    pub fn is_false(&self) -> bool {
        !self.is_true()
    }

    pub fn type_name(&self) -> &str {
        type_name::<Self>()
    }
}

impl Display for TocResult {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Fun(v) => write!(f, "{}", v.to_string()),
            Self::String(v) => write!(f, "{}", v),
            Self::Number(v) => write!(f, "{}", v),
            Self::Bool(v) => write!(f, "{}", v),
            Self::Null => write!(f, "null"),
        }
    }
}

impl ops::Add<TocResult> for TocResult {
    type Output = Result<TocResult, TocErr>;

    fn add(self, rhs: TocResult) -> Self::Output {
        match (self, rhs) {
            (Self::String(l), Self::String(r)) => Ok(Self::String(l + &r)),
            (Self::Number(l), Self::Number(r)) => Ok(Self::Number(l + r)),
            _ => Err(TocErr::new(
                TocErrKind::RuntimeError,
                &format!("'+' operator only support both operand is string or number."),
            ))
        }
    }
}

impl PartialEq<TocResult> for TocResult {
    fn eq(&self, other: &TocResult) -> bool {
        match (self, other) {
            (Self::String(l0), Self::String(r0)) => l0 == r0,
            (Self::Number(l0), Self::Number(r0)) => l0 == r0,
            (Self::Bool(l0), Self::Bool(r0)) => l0 == r0,
            (Self::Null, Self::Null) => true,
            _ => false,
        }
    }
}

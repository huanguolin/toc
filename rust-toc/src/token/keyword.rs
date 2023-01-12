use std::{fmt::Display, str::FromStr};

use crate::error::{TocErr, TocErrKind};

#[derive(Debug, Clone)]
pub enum Keyword {
    Fun,
    Var,
    For,
    If,
    Else,
    True,
    False,
    Null,
}

impl Display for Keyword {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Fun => write!(f, "fun"),
            Self::Var => write!(f, "var"),
            Self::For => write!(f, "for"),
            Self::If => write!(f, "if"),
            Self::Else => write!(f, "else"),
            Self::True => write!(f, "true"),
            Self::False => write!(f, "false"),
            Self::Null => write!(f, "null"),
        }
    }
}

impl FromStr for Keyword {
    type Err = TocErr;
    fn from_str(s: &str) -> Result<Self, TocErr> {
        match s {
            "fun" => Ok(Self::Fun),
            "var" => Ok(Self::Var),
            "for" => Ok(Self::For),
            "if" => Ok(Self::If),
            "else" => Ok(Self::Else),
            "true" => Ok(Self::True),
            "false" => Ok(Self::False),
            "null" => Ok(Self::Null),
            _ => Err(TocErr::new(
                TocErrKind::UnknownKeyword,
                &format!("Unknown keyword: {}.", s),
            )),
        }
    }
}

impl PartialEq for Keyword {
    fn eq(&self, other: &Self) -> bool {
        core::mem::discriminant(self) == core::mem::discriminant(other)
    }
}

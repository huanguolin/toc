use std::str::FromStr;

use crate::error::{TocErr, TocErrKind};

#[derive(Debug)]
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
                TocErrKind::ParseKeywordFail,
                format!("Unknown keyword: {}", s),
            ))
        }
    }
}
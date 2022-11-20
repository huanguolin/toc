use std::str::FromStr;

use crate::error::{TocErr, TocErrKind};

#[derive(Debug)]
pub enum Symbol {
    // single-char
    LeftBrace,  // {
    RightBrace, // }
    LeftParen,  // (
    RightParen, // )
    Semicolon,  // ;
    Comma,      // ,
    Assign,     // =
    Plus,       // +
    Minus,      // -
    Slash,      // /
    Star,       // *
    Less,       // <
    Greater,    // >
    Bang,       // !

    // two-chars
    LessEqual,    // <=
    GreaterEqual, // >=
    Equal,        // ==
    NotEqual,     // !=
    And,          // &&
    Or,           // ||
}

impl FromStr for Symbol {
    type Err = TocErr;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            // single-char
            "{" => Ok(Self::LeftBrace),
            "}" => Ok(Self::RightBrace),
            "(" => Ok(Self::LeftParen),
            ")" => Ok(Self::RightParen),
            ";" => Ok(Self::Semicolon),
            "," => Ok(Self::Comma),
            "=" => Ok(Self::Assign),
            "+" => Ok(Self::Plus),
            "-" => Ok(Self::Minus),
            "/" => Ok(Self::Slash),
            "*" => Ok(Self::Star),
            "<" => Ok(Self::Less),
            ">" => Ok(Self::Greater),
            "!" => Ok(Self::Bang),

            // two-chars
            "<=" => Ok(Self::LessEqual),
            ">=" => Ok(Self::GreaterEqual),
            "==" => Ok(Self::Equal),
            "!=" => Ok(Self::NotEqual),
            "&&" => Ok(Self::And),
            "||" => Ok(Self::Or),

            _ => Err(TocErr::new(
                TocErrKind::UnknownSymbol,
                format!("Unknown symbol: {}", s),
            ))
        }
    }
}

impl PartialEq for Symbol {
    fn eq(&self, other: &Self) -> bool {
        core::mem::discriminant(self) == core::mem::discriminant(other)
    }
}
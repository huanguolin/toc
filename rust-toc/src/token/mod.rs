pub mod keyword;
pub mod symbol;

use std::{str::FromStr, fmt::Display};

use crate::{
    error::{TocErr, TocErrKind},
    ext::str::FirstChar,
};

use self::{keyword::Keyword, symbol::Symbol};

#[derive(Debug)]
pub enum Token {
    Identifier(String, u32),
    String(String, u32),
    Number(u32, u32),
    Keyword(Keyword, u32),
    Symbol(Symbol, u32),
}

impl Display for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Token::Identifier(i, l) => write!(f, "Identifier({}) at line {}", i, l),
            Token::String(s, l) => write!(f, "String({}) at line {}", s, l),
            Token::Number(n, l) => write!(f, "Number({}) at line {}", n, l),
            Token::Keyword(k, l) => write!(f, "Keyword({}) at line {}", k, l),
            Token::Symbol(sym, l) => write!(f, "Symbol({}) at line {}", sym, l),
        }
    }
}

impl Token {
    pub fn from(str: &str, line_num: u32) -> Result<Self, TocErr> {
        if let Ok(sym) = Symbol::from_str(str) {
            Ok(Token::Symbol(sym, line_num))
        } else if let Ok(kwd) = Keyword::from_str(str) {
            Ok(Token::Keyword(kwd, line_num))
        } else if str.first_char_is_some_and(|c| c == '"') {
            Ok(Token::String(str.to_string(), line_num))
        } else if str.first_char_is_numeric() {
            Ok(Token::Number(str.parse().unwrap(), line_num))
        } else if str.first_char_is_alpha() {
            Ok(Token::Identifier(str.to_string(), line_num))
        } else {
            Err(TocErr::new(
                TocErrKind::UnknownToken,
                &format!("Unknown token '{}' at line {}.", str, line_num),
            ))
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            Token::Identifier(i, _) => i.to_string(),
            Token::String(s, _) => s.to_string(),
            Token::Number(n, _) => n.to_string(),
            Token::Keyword(k, _) => k.to_string(),
            Token::Symbol(sym, _) => sym.to_string(),
        }
    }

    pub fn is_literal_keyword(&self) -> bool {
        match self {
            Token::Keyword(k, _) => *k == Keyword::True || *k == Keyword::False || *k == Keyword::Null,
            _ => false,
        }
    }

    pub fn is_symbol(&self, symbol: &Symbol) -> bool {
        match self {
            Token::Symbol(i, _) => i == symbol,
            _ => false,
        }
    }

    pub fn is_keyword(&self, keyword: &Keyword) -> bool {
        match self {
            Token::Keyword(i, _) => i == keyword,
            _ => false,
        }
    }

    // pub fn line_num(&self) -> &u32 {
    //     match self {
    //         Token::Identifier(_, i) => i,
    //         Token::String(_, s) => s,
    //         Token::Number(_, n) => n,
    //         Token::Keyword(_, k) => k,
    //         Token::Symbol(_, sym) => sym,
    //     }
    // }
}

impl PartialEq for Token {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Self::Identifier(l, _), Self::Identifier(r, _)) => l == r,
            (Self::String(l, _), Self::String(r, _)) => l == r,
            (Self::Number(l, _), Self::Number(r, _)) => l == r,
            (Self::Keyword(l, _), Self::Keyword(r, _)) => l == r,
            (Self::Symbol(l, _), Self::Symbol(r, _)) => l == r,
            _ => false,
        }
    }
}

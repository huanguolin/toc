pub mod keyword;
pub mod symbol;

use std::str::FromStr;

use crate::{
    error::{TocErr, TocErrKind},
    ext::str::FirstChar,
};

use self::{keyword::Keyword, symbol::Symbol};

#[derive(Debug)]
pub enum Token {
    Identifier(String),
    String(String),
    Number(u8),
    Keyword(Keyword),
    Symbol(Symbol),
}

impl FromStr for Token {
    type Err = TocErr;

    fn from_str(s: &str) -> Result<Self, TocErr> {
        if let Ok(sym) = Symbol::from_str(s) {
            Ok(Token::Symbol(sym))
        } else if let Ok(kwd) = Keyword::from_str(s) {
            Ok(Token::Keyword(kwd))
        } else if s.first_char_is_some_and(|c| c == '"') {
            Ok(Token::String(s.to_string()))
        } else if s.first_char_is_numeric() {
            Ok(Token::Number(s.parse().unwrap()))
        } else if s.first_char_is_alpha() {
            Ok(Token::Identifier(s.to_string()))
        } else {
            Err(TocErr::new(
                TocErrKind::ParseTokenFail,
                format!("Unknown token: {}", s),
            ))
        }
    }
}

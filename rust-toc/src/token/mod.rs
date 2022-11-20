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
    Identifier(String, u32),
    String(String, u32),
    Number(u8, u32),
    Keyword(Keyword, u32),
    Symbol(Symbol, u32),
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
                TocErrKind::ParseTokenFail,
                format!("Unknown token: {}", str),
            ))
        }
    }
}


use crate::error::{TocErr, TocErrKind};

#[derive(Debug)]
pub enum Token {
    // literal
    Identifier(String),
    String(String),
    Number(u8),

    // keywords
    Fun,
    Var,
    For,
    If,
    Else,
    True,
    False,
    Null,

    // single-char token
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

    // two-chars token
    LessEqual,    // <=
    GreaterEqual, // >=
    Equal,        // ==
    NotEqual,     // !=
    And,          // &&
    Or,           // ||
}

impl Token {
    pub fn from(s: &str) -> Result<Self, TocErr> {
        match s {
            // single-char token
            "{" => Ok(Token::LeftBrace),
            "}" => Ok(Token::RightBrace),
            "(" => Ok(Token::LeftParen),
            ")" => Ok(Token::RightParen),
            ";" => Ok(Token::Semicolon),
            "," => Ok(Token::Comma),
            "=" => Ok(Token::Assign),
            "+" => Ok(Token::Plus),
            "-" => Ok(Token::Minus),
            "/" => Ok(Token::Slash),
            "*" => Ok(Token::Star),
            "<" => Ok(Token::Less),
            ">" => Ok(Token::Greater),
            "!" => Ok(Token::Bang),

            // two-chars token
            "<=" => Ok(Token::LessEqual),
            ">=" => Ok(Token::GreaterEqual),
            "==" => Ok(Token::Equal),
            "!=" => Ok(Token::NotEqual),
            "&&" => Ok(Token::And),
            "||" => Ok(Token::Or),

            // keywords
            "fun" => Ok(Token::Fun),
            "var" => Ok(Token::Var),
            "for" => Ok(Token::For),
            "if" => Ok(Token::If),
            "else" => Ok(Token::Else),
            "true" => Ok(Token::True),
            "false" => Ok(Token::False),
            "null" => Ok(Token::Null),

            _ => {
                if let Some(c) = s.chars().next() {
                    if c == '"' {
                        Ok(Token::String(s.to_string()))
                    } else if c.is_ascii_digit() {
                        Ok(Token::Number(s.parse().unwrap()))
                    } else {
                        Ok(Token::Identifier(s.to_string()))
                    }
                } else {
                    Err(TocErr::new(
                        TocErrKind::ParseTokenFail,
                        format!("Unknown token: {}", s),
                    ))
                }
            },
        }
    }
}


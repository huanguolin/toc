// use unicode_segmentation::UnicodeSegmentation;

use crate::token::{Token};

pub struct Scanner {
    src: String,
    tokens: Vec<Token>,
}

impl Scanner {
    pub fn new() -> Scanner {
        Scanner {
            src: String::new(),
            tokens: Vec::with_capacity(0)
        }
    }

    pub fn scan(&mut self, src: String) -> &Vec<Token> {
        self.src = src;
        self.tokens.clear();

        for c in self.src.chars() {
            let t = match c {
                '{' => c.to_string(),
                '}' => c.to_string(),
                ',' => c.to_string(),
                ';' => c.to_string(),
                '(' => c.to_string(),
                ')' => c.to_string(),
                '*' => c.to_string(),
                '/' => c.to_string(),
                '+' => c.to_string(),
                '-' => c.to_string(),
                _ => c.to_string(),
            };
            if let Ok(token) = Token::from(&t) {
                self.tokens.push(token);
            }
        }

        &self.tokens
    }
}

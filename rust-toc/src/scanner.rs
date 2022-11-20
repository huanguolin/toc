
use std::{cell::Cell};

use unicode_segmentation::UnicodeSegmentation;

use crate::error::{TocErr, TocErrKind};
use crate::ext::str::{FirstChar, IsNewline};
use crate::token::Token;

pub fn scan(src: String) -> Result<Vec<Token>, TocErr> {
    Scanner::new(&src).scan()
}

/**
 * Only for inner use.
 */
struct Scanner<'a> {
    src: &'a str,
    graphemes: Vec<(usize, &'a str)>,
    index: Cell<usize>,
    line_num: Cell<u32>,
    tokens: Cell<Vec<Token>>,
}

impl<'a> Scanner<'a> {
    fn new(src: &'a str) -> Scanner<'a> {
        Scanner {
            src,
            graphemes: UnicodeSegmentation::grapheme_indices(src, true).collect::<Vec<(usize, &str)>>(),
            index: Cell::new(0),
            line_num: Cell::new(1),
            tokens: Cell::new(Vec::new()),
        }
    }

    fn scan(&mut self) -> Result<Vec<Token>, TocErr> {
        while !self.is_end() {
            let s = self.advance();
            let ln = self.line_num();
            let t = match s {
                "\u{0020}" | "\t" | "\r\n" | "\n" => {
                    if s.is_newline() {
                        self.inc_line_num();
                    }
                    continue
                },
                "{" | "}" | "," | ";" | "(" | ")" | "*" | "/" | "+" | "-" => Ok(s),
                ">" | "<" | "!" | "=" => {
                    Ok(if self.next_is("=") {
                        self.get_token_str_by_len(2)
                    } else {
                        s
                    })
                },
                "&" => {
                    Ok(if self.next_is("&") {
                        self.get_token_str_by_len(2)
                    } else {
                        s
                    })
                },
                "|" => {
                    Ok(if self.next_is("|") {
                        self.get_token_str_by_len(2)
                    } else {
                        s
                    })
                },
                "\"" => Ok(self.get_string()),
                _ => {
                    if s.first_char_is_numeric() {
                        Ok(self.get_number())
                    } else if s.first_char_is_alpha() {
                        Ok(self.get_identifier())
                    } else {
                        Err(TocErr::new(
                            TocErrKind::ScanFail,
                            format!("Unknown token '{}' at line {}.", s, ln),
                        ))
                    }
                },
            };
            self.add_token(Token::from(t?, ln)?);
        }

        Ok(self.tokens.take())
    }

    fn add_token(&mut self, t: Token) {
        self.tokens.get_mut().push(t);
    }

    fn index(&self) -> usize {
        self.index.get()
    }

    fn inc_index(&self) {
        let i = self.index();
        self.index.set(i+1);
    }

    fn line_num(&self) -> u32 {
        self.line_num.get()
    }

    fn inc_line_num(&self) {
        let i = self.line_num();
        self.line_num.set(i+1);
    }

    fn advance(&self) -> &str {
        let c = self.current();
        self.inc_index();
        c
    }

    fn current(&self) -> &str {
        self.graphemes[self.index()].1
    }

    fn is_end(&self) -> bool {
        self.index() >= self.graphemes.len()
    }

    fn next_is(&self, c: &str) -> bool {
        if self.is_end() {
            false
        } else if self.current() == c {
            self.advance();
            true
        } else {
            false
        }
    }

    fn get_token_str_by_len(&self, len: usize) -> &str {
        let end = self.index();
        self.get_token_str_by_range(end - len, end)
    }

    fn get_token_str_by_range(&self, start: usize, end: usize) -> &str {
        let i = self.graphemes[start].0;
        if end >= self.graphemes.len() {
            &self.src[i..]
        } else {
            let j = self.graphemes[end].0;
            &self.src[i..j]
        }
    }

    fn get_string(&self) -> &str {
        let mut len = 1; // count from "
        while !self.is_end() && self.current() != "\"" {
            if self.current().is_newline() {
                self.inc_line_num();
            }
            self.advance();
            len += 1;
        }

        if self.is_end() {
            ""
        } else {
            self.advance(); // consume "
            len += 1;
            self.get_token_str_by_len(len)
        }
    }

    fn get_number(&self) -> &str {
        let mut len = 1;
        while !self.is_end() && self.current().first_char_is_numeric() {
            self.advance();
            len += 1;
        }
        self.get_token_str_by_len(len)
    }

    fn get_identifier(&self) -> &str {
        let mut len = 1; // count from "
        while !self.is_end() && self.current().first_char_is_alphanumeric() {
            self.advance();
            len += 1;
        }
        self.get_token_str_by_len(len)
    }

}

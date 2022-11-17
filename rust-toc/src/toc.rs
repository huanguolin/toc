use crate::{scanner::Scanner, token::Token};


pub struct Toc {
    scanner: Scanner,
}

impl Toc {
    pub fn new() -> Self {
        Toc { scanner: Scanner::new() }
    }

    pub fn eval(&mut self, src: String) -> &Vec<Token> {
        self.scanner.scan(src)
    }
}
use crate::{scanner::scan, token::Token, error::TocErr};


pub struct Toc {
}

impl Toc {
    pub fn new() -> Self {
        Toc { }
    }

    pub fn eval(&self, src: String) -> Result<Vec<Token>, TocErr> {
        scan(src)
    }
}
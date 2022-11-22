use crate::{scanner::scan, error::TocErr, parser::parse, expr::Expr};


pub struct Toc {
}

impl Toc {
    pub fn new() -> Self {
        Toc { }
    }

    pub fn eval(&self, src: String) -> Result<Expr, TocErr> {
        parse(scan(src)?)
    }
}
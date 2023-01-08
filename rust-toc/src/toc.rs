use crate::{
    error::TocErr, interpreter::Interpreter, parser::parse, scanner::scan, toc_result::TocResult,
};

pub struct Toc {
    interpreter: Interpreter,
}

impl Toc {
    pub fn new() -> Self {
        Toc {
            interpreter: Interpreter::new(),
        }
    }

    pub fn eval(&self, src: String) -> Result<TocResult, TocErr> {
        let tokens = scan(src)?;
        let expr = parse(tokens)?;
        // log::debug!("expr:\n{}", expr);
        self.interpreter.interpret(expr)
    }
}

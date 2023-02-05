use colored::Colorize;

use crate::{
    error::TocErr, interpreter::Interpreter, parser::parse, scanner::scan, stmt::Stmt,
    toc_result::TocResult,
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
        let stmts = parse(tokens)?;
        self.interpreter.interpret(stmts)
    }

    pub fn eval_for_debug(&self, src: String) -> String {
        let tr = scan(src);
        match tr {
            Err(err) => err_to_string(err),
            Ok(tokens) => {
                let sr = parse(tokens);
                match sr {
                    Err(err) => err_to_string(err),
                    Ok(stmts) => to_s_expr_string(stmts),
                }
            }
        }
    }
}

fn to_s_expr_string(stmts: Vec<Stmt>) -> String {
    format!(
        "{}",
        stmts
            .into_iter()
            .fold(String::new(), |a, b| a + "\n" + &b.to_string())
            .trim_start()
            .to_string()
    )
}

fn err_to_string(err: TocErr) -> String {
    format!("{}", err.to_string().red().bold())
}

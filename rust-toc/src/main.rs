
mod ext;
mod error;
mod token;
mod scanner;
mod expr;
mod parser;
mod toc;

use colored::Colorize;
use error::TocErr;
use expr::expr::Expr;
use std::{env, io::{self, BufRead, Write}, fs};
use toc::Toc;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 {
        eval_src_file(args.get(1).unwrap());
    } else {
        repl();
    }
}

fn eval_src_file(file: &str) {
    match fs::read_to_string(file) {
        Ok(src) => print_result(Toc::new().eval(src)),
        Err(err) => eprintln!("{} {}", "[Error] Read source code failed:".red().bold(), err.to_string().red().bold())
    }
}

fn repl() {
    let toc = Toc::new();
    print_arrow();
    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        let src = line.unwrap();
        print_result(toc.eval(src));
        print_arrow();
    }
}

fn print_result(result: Result<Expr, TocErr>) {
    match result {
        Ok(val) => println!("{} {}", "=".green(), val.to_string()),
        Err(err) => eprintln!("{}", err.to_string().red().bold())
    }
}

fn print_arrow() {
    print(&"> ".blue().to_string());
}

fn print(str: &str) {
    print!("{}", str);
    let _ = io::stdout().flush();
}

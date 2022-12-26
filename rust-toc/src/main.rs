use colored::Colorize;
use std::{env, fs, sync::{Mutex, Arc}};

use rust_toc::{toc::Toc, error::TocErr, toc_result::TocResult, repl::Repl};

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
        Ok(src) => println!("{}", fmt_result(Toc::new().eval(src))),
        Err(err) => eprintln!(
            "{} {}",
            "[Error] Read source code failed:".red().bold(),
            err.to_string().red().bold()
        ),
    }
}

fn repl() {
    let toc = Arc::new(Mutex::new(Toc::new()));
    let mut repl = Repl::init(16);

    repl.run("> ", |src| fmt_result(toc.lock().unwrap().eval(src)));
}

fn fmt_result(result: Result<TocResult, TocErr>) -> String {
    match result {
        Ok(val) => format!("{} {}", "=".green(), val.to_string()),
        Err(err) => format!("{}", err.to_string().red().bold()),
    }
}

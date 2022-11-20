
mod ext;
mod error;
mod token;
mod scanner;
mod toc;

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
        Ok(src) => {
            let val = Toc::new().eval(src);
            println!("= {:?}", val)
        },
        Err(err) => println!("[Error] Read source code failed: {}", err)
    }
}

fn repl() {
    let toc = Toc::new();
    print_arrow();
    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        let src = line.unwrap();
        let val = toc.eval(src);
        println!("= {:?}", val);
        print_arrow();
    }
}

fn print_arrow() {
    print("> ");
}

fn print(str: &str) {
    print!("{}", str);
    let _ = io::stdout().flush();
}

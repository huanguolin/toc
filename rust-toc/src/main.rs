
mod ext;
mod error;
mod token;
mod scanner;
mod toc;

use std::{io::{self, BufRead, Write}};
use toc::Toc;

fn main() {
    let mut toc = Toc::new();
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

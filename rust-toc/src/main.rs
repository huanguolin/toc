use std::io::{self, BufRead, Write};

fn main() {
    print_arrow();
    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        let src = line.unwrap();
        let val = toc(src);
        println!("= {}", val);
        print_arrow();
    }
}

fn toc(src: String) -> String {
    src
}

fn print_arrow() {
    print("> ");
}

fn print(str: &str) {
    print!("{}", str);
    let _ = io::stdout().flush();
}

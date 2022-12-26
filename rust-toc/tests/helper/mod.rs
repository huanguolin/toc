use rust_toc::toc::Toc;

pub fn toc(input: &str, output: &str) {
    let mut toc = Toc::new();
    let v = toc.eval(input.to_owned()).unwrap().to_string();
    assert_eq!(&v, output);
}

pub fn toc_err(input: &str) {
    let mut toc = Toc::new();
    if let Err(e) = toc.eval(input.to_owned()) {
        panic!("{}", e);
    }
}
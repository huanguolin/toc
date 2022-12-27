mod helper;

use helper::{toc, toc_err};
use rstest::rstest;

#[rstest]
#[case("1 + 2;", "3")]
fn expr_test(#[case] input: &str, #[case] output: &str) {
    toc(input, output);
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect ';' after expression. but got end.")]
fn expr_error_1() {
    toc_err("1 + 3");
}
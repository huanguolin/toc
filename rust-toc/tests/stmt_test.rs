mod helper;

use helper::{toc, toc_err};
use rstest::rstest;

#[rstest]
// expr
#[case("1 + 2;", "3")]
// block scope
#[case("var b = 4;
{
    var a= b = 3;
}", "3")]
#[case("var b = 4;
{
    var b = 3;
    b = 99;
}
var c = b + 12;", "16")]
#[case("{}", "null")]
fn expr_test(#[case] input: &str, #[case] output: &str) {
    toc(input, output);
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect ';' after expression. but got end.")]
fn expr_error_1() {
    toc_err("1 + 3");
}
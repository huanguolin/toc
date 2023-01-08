mod helper;

use helper::{toc, toc_err};
use rstest::rstest;

#[rstest]
// expr
#[case("1 + 2;", "3")]
// block scope
#[case("
    var b = 4;
    {
        var a= b = 3;
    }",
    "3")]
#[case("
    var b = 4;
    {
        var b = 3;
        b = 99;
    }
    var c = b + 12;",
    "16"
    )]
#[case("{}", "null")]
// if statement
#[case("
    var b = 4;
    if (b > 3) b = 1995;",
    "1995")]
#[case("
    var b = 0;
    if (b > 3) b = 1995;",
    "null")]
#[case("
    var b = 0;
    if (b > 3) b = 1995;
    else b = false;",
    "false")]
#[case("
    var a = 0;
    if (true) { var a = null; }
    else { var a = false; }
    a;",
    "0")]
#[case("
    if (false) { }
    else { }",
    "null")]
fn expr_test(#[case] input: &str, #[case] output: &str) {
    toc(input, output);
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect ';' after expression. but got end.")]
fn expr_error_1() {
    toc_err("1 + 3");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect '}' end the block.")]
fn expr_error_2() {
    toc_err("{");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got token Keyword(var) at line 2.")]
fn expr_error_3() {
    toc_err("
        if (true) var b = 1;
        else var b = false;");
}
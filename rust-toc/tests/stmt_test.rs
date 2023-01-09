mod helper;

use helper::{toc, toc_err};
use rstest::rstest;

#[rstest]
// empty stmt
#[case(" ", "null")]
// expr stmt
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
// for statement
#[case("
    var x = 0;
    for (;false;)
        x = x + 8;
    x;",
    "0")]
#[case("
    var x = 0;
    for (var i = 1; i < 5; i=i+1)
        x = x + i;
    x;",
    "10")]
#[case("
    var x = 0;
    var i = 1;
    for (; i < 5; i=i+1)
        x = x + i;
    ",
    "10")]
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

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got end.")]
fn expr_error_4() {
    toc_err("for(");
}
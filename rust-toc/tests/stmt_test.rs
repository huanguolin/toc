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
// fun declaration
#[case(" fun a() {} ", "<fun a()>")]
#[case("
    fun a() {}
    var b = 9;
", "9")]
#[case(" fun a () { var a = 5;} ", "<fun a()>")]
#[case("
    fun a () { var a = 5;}
    var b = 0;
    a;
", "<fun a()>")]
#[case("
    fun a(p1, p2) { var a = 5;}
    a;
", "<fun a(p1, p2)>")]
// fun call expr
#[case("
    fun a() {}
    a();
    ", "null")]
#[case("
    fun a(p1, p2) { var a = 5;}
    a(1, 2);
", "5")]
#[case("
    var i = 0;
    fun a(p1, p2) {
        p1 + p2;
    }
    a(i = i+5, i = i+6);
    a(i, i);
", "22")]
#[case("
    var i = 0;
    fun a(p1) {
        var i = p1 + 5;
        i;
    }
    a(10);
    i;
", "0")]
#[case("
    fun incN(n) {
        fun inc(x) {
            x + n;
        }
    }
    var inc3 = incN(3);
    inc3(1);
", "4")]
#[case("
    fun t() {
        var x = 7;
        fun get() {
            x;
        }
    }
    t()();
", "7")]
#[case("
    fun fib(n) {
        if (n <= 2) { 1; }
        else { fib(n-1) + fib(n-2); }
    }
    fib(6);
", "8")]
fn stmt_test(#[case] input: &str, #[case] output: &str) {
    toc(input, output);
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect ';' after expression. but got end.")]
fn stmt_error_1() {
    toc_err("1 + 3");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect '}' end the block.")]
fn stmt_error_2() {
    toc_err("{");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got token Keyword(var) at line 2.")]
fn stmt_error_3() {
    toc_err("
        if (true) var b = 1;
        else var b = false;");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got end.")]
fn stmt_error_4() {
    toc_err("for(");
}

#[test]
#[should_panic(expected = "[RuntimeError]: Call <fun a(p1, p2)> error, arguments length not match parameters, required 2, given 0.")]
fn stmt_error_5() {
    toc_err("fun a(p1, p2) { var a = 5;} a(); ");
}
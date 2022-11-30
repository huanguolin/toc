mod helper;

use helper::{toc, toc_err};
use rstest::rstest;

#[rstest]
// + -
#[case("1 + 2;", "3")]
#[case("0 + 999;", "999")]
#[case("123 + 32;", "155")]
#[case("999 - 1;", "998")]
#[case("999 - 0;", "999")]
#[case("999 - 991;", "8")]
#[case("123 - 991;", "0")]
// *, /, %
#[case("1 * 135;", "135")]
#[case("3 * 0;", "0")]
#[case("3 * 123;", "369")]
#[case("0 / 3;", "0")]
#[case("1 / 3;", "0")]
#[case("999 / 3;", "333")]
#[case("8 % 3;", "2")]
#[case("0 % 3;", "0")]
#[case("2 % 3;", "2")]
// group
#[case("2 * (3 - 2);", "2")]
#[case("2 * ((3 - 2) + 9);", "20")]
#[case("(0);", "0")]
// !
#[case("!false;", "true")]
#[case("!true;", "false")]
#[case("!0;", "true")]
#[case("!null;", "true")]
#[case("!1;", "false")]
#[case("!!1;", "true")]
// ==
#[case("0 == 0;", "true")]
#[case("3 == 3;", "true")]
#[case("false == false;", "true")]
#[case("true == true;", "true")]
#[case("null == null;", "true")]
#[case("5 == 9;", "false")]
#[case("false == 9;", "false")]
#[case("false == true;", "false")]
#[case("false == null;", "false")]
#[case("false == 0;", "false")]
// !=
#[case("0 != 0;", "false")]
#[case("3 != 3;", "false")]
#[case("false != false;", "false")]
#[case("true != true;", "false")]
#[case("null != null;", "false")]
#[case("5 != 9;", "true")]
#[case("false != 9;", "true")]
#[case("false != true;", "true")]
#[case("false != null;", "true")]
#[case("false != 0;", "true")]
// >
#[case("9 > 0;", "true")]
#[case("9 > 9;", "false")]
#[case("9 > 10;", "false")]
// >=
#[case("9 >= 0;", "true")]
#[case("9 >= 9;", "true")]
#[case("9 >= 10;", "false")]
// <
#[case("9 < 0;", "false")]
#[case("9 < 9;", "false")]
#[case("9 < 10;", "true")]
// <=
#[case("9 <= 0;", "false")]
#[case("9 <= 9;", "true")]
#[case("9 <= 10;", "true")]
// &&
#[case("9 && 10;", "10")]
#[case("0 && 10;", "0")]
#[case("true && false;", "false")]
// #[case("var a = 0; a && (a = 5); a;", "0")]
// #[case("var a = 1; a && (a = 5); a;", "5")]
// ||
#[case("9 || 10;", "9")]
#[case("0 || 10;", "10")]
#[case("true || false;", "true")]
// #[case("var a = 0; a || (a = 5); a;", "5")]
// #[case("var a = 1; a || (a = 5); a;", "1")]
// other
#[case("123 % 100 + 15 - 12 / 3 / ( 5 -3);", "36")]
#[case("(5 -3 ) * 6 || 7 - ( 9 / 3 );", "12")]
// space
#[case("1+10;", "11")]
#[case("    1 +10  ;  ", "11")]
#[case("\t  \n1 +\t10  ;   ", "11")]
// var
// #[case("var a; a;", "null")]
// #[case("var a; a = !!a; a;", "false")]
// #[case("var a = 3 + 9 % 5;", "7")]
// #[case("var a = 3 + 9 % 5; var b = a = 4 * 5 - 12 / 3;", "16")]
fn expr_test(#[case] input: &str, #[case] output: &str) {
    toc(input, output);
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got end.")]
fn expr_error_1() {
    toc_err("1 +");
}

#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got token Symbol(+) at line 1.")]
fn expr_error_2() {
    toc_err("+ 2");
}


#[test]
#[should_panic(expected = "[ParseFail]: Expect expression, but got token Symbol(+) at line 1.")]
fn expr_error_3() {
    toc_err("1 + + 2");
}
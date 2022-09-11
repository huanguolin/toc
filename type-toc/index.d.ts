import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Scan } from "./scanner";

type Result = Interpret<Parse<Scan<'var a = 5; a + 9;'>>>;


// type Input = ' 123 % 100 + 15 - 12 / 3 / ( 5 -3);';
// type Input = '(5 -3 ) * 6 || 7 - ( 9 / 3 );';
type Input = 'var b = 4; var a= b = 3; var c = b + 12;';
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
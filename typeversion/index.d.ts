import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Scan } from "./scanner";

type Result = Interpret<Parse<Scan<'!(9 > 6)'>>>;


// type Input = ' 123 % 100 + 15 - 12 / 3 / ( 5 -3)';
type Input = '7 > 9';
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Scan } from "./scanner";

type Input = '123 + 2 - 5';
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type d = Ast['operator']
type Output = Interpret<Ast>;
import { Interpret } from "./interpreter";
import { Parse } from "./parser";
import { Scan } from "./scanner";

type Input = ' 123 + 5 * (3 - 2)';
type Tokens = Scan<Input>;
type Ast = Parse<Tokens>;
type Output = Interpret<Ast>;
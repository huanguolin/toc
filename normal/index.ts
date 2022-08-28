import { Parser } from './Parser';
import { Scanner } from './Scanner';

calculator('4 + 5 * (10 - 2) / 2');

function calculator(source: string) {
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.scan());
    const result = parser.parse();
    console.log(result);
}

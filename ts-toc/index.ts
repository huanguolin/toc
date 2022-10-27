import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { Scanner } from './Scanner';

const readline = require('readline');
const interpreter = new Interpreter();

main();

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    process.stdout.write('> ');
    rl.on('line', function (line: string) {
        try {
            const result = toc(line);
            const printVal = result && typeof result === 'object' ? result.toString() : result;
            console.log('=', printVal);
        } catch (e) {
            let errMsg = e;
            if (e instanceof Error) {
                errMsg = e.message;
            }
            console.error('Error: ', errMsg);
        }
        process.stdout.write('> ');
    });
}

function toc(source: string) {
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.scan());
    return interpreter.interpret(parser.parse());
}

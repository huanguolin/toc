import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { Scanner } from './Scanner';

const readline = require('readline');

main();

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    process.stdout.write('> ');
    rl.on('line', function (line) {
        try {
            const result = run(line);
            console.log('=', result);
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

function run(source: string) {
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.scan());
    const interpreter = new Interpreter(parser.parse());
    return interpreter.interpret();
}

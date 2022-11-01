export class ParseError extends Error {
    constructor(message: string) {
        super('[ParseError]: ' + message);
    }
}

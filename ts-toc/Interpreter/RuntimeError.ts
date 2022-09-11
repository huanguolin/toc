export class RuntimeError extends Error {
    constructor(message: string) {
        super('[RuntimeError]: ' + message);
    }
}
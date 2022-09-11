export class ScanError extends Error {
    constructor(message: string) {
        super('[ScanError]: ' + message);
    }
}
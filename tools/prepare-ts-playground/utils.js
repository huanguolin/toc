const LZString = require('lz-string');

module.exports = {
    getLogger,
    buildTsPlaygroundUrl,
};

function buildTsPlaygroundUrl(srcCode) {
    const urlPrefix = 'https://www.typescriptlang.org/play?#code/';
    const encodedSrcCode = LZString.compressToEncodedURIComponent(srcCode);
    return urlPrefix + encodedSrcCode;
}

function getLogger(name) {
    return {
        log: gen('log'),
        error: gen('error'),
    };

    function gen(type) {
        return (...args) => {
            args.unshift(`[${name}]`);
            console[type](...args);
        };
    }
}
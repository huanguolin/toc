const LZString = require('lz-string');
const axios = require('axios');

module.exports = {
    getLogger,
    buildTsPlaygroundUrl,
};

async function buildTsPlaygroundUrl(srcCode) {
    const urlPrefix = 'https://www.typescriptlang.org/play?#code/';
    const encodedSrcCode = LZString.compressToEncodedURIComponent(srcCode);
    const longUrl = urlPrefix + encodedSrcCode;
    return await shortenTsPlayUrl(longUrl);
}

async function shortenTsPlayUrl(longUrl) {
    // Thanks to https://tsplay-dev.vercel.app/
    const body = {
        createdOn: 'client',
        expires: false,
        url: longUrl,
    };
    const res = await axios.post('https://tsplay.dev/api/short', body, {
        headers: {
            ['content-type']: 'application/json',
            ['origin']: 'https://tsplay-dev.vercel.app',
            ['referer']: 'https://tsplay-dev.vercel.app/',
            ['user-agent']: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        },
    });
    return res.data.shortened;
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
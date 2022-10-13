const dts = require('@qiwi/dts-bundle');
const path = require('path');
const LZString = require('lz-string');
const fs = require('fs');

const mergeFilePath = path.resolve('./toc.d.ts');

// Merge to ./toc.d.ts
try {
    dts.bundle({
        name: 'toc',
        main: '../../type-toc/index.d.ts',
        out: mergeFilePath,
        exclude: /node_modules\/.*/,
    });
    console.log('Merge files success!');
} catch (err) {
    console.error(`Merge files error: ${err}`);
}

// Build url for ts playground.
let url = '';
try {
    const urlPrefix = 'https://www.typescriptlang.org/play?#code/';
    const srcCode = fs.readFileSync(mergeFilePath, 'utf8');
    const encodedSrcCode = LZString.compressToEncodedURIComponent(srcCode);
    url = urlPrefix + encodedSrcCode;
    console.log('Build url success!');
} catch (err) {
    console.error(`Read file form ${mergeFilePath} error: ${err}`);
}

// Update README.md.
const readmePath = path.resolve('../../README.md');
try {
    let readme = fs.readFileSync(readmePath, 'utf8');
    readme = readme.replace(/Click\s\[here\]\(\w+?\)/, `Click [here](${url})`);
    try {
        fs.writeFileSync(readmePath, readme);
        console.log('Update readme success!');
    } catch (err) {
        console.error(`Read file form ${readmePath} error: ${err}`);
    }
} catch (err) {
    console.error(`Read file form ${readmePath} error: ${err}`);
}

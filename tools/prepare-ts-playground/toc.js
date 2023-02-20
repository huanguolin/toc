const dts = require('@qiwi/dts-bundle');
const path = require('path');
const fs = require('fs');

const utils = require('./utils');

const { log, error } = utils.getLogger('toc');

const mergeFilePath = path.resolve('./toc.d.ts');

// entry point
main();

async function main() {
    // Merge to ./toc.d.ts
    if (!mergeTypeToc()) {
        return;
    }

    // Build url for ts playground.
    const url = await buildTsPlayUrl();
    if (!url) {
        return;
    }

    // Update README.md.
    updateReadme(url);
}

function mergeTypeToc() {
    try {
        dts.bundle({
            name: 'toc',
            main: '../../type-toc/index.d.ts',
            out: mergeFilePath,
            headerPath: path.resolve('./header.txt'),
        });
        log('Merge files success!');
    } catch (err) {
        error(`Merge files error: ${err}`);
        return false;
    }
    return true;
}

async function buildTsPlayUrl() {
    let url = '';
    try {
        const srcCode = fs.readFileSync(mergeFilePath, 'utf8');
        try {
            url = await utils.buildTsPlaygroundUrl(srcCode);
            log('Build url success!');
        } catch (err) {
            error(`Build ts play ground url error: ${err}`);
        }
    } catch (err) {
        error(`Read file form ${mergeFilePath} error: ${err}`);
    }
    return url;
}

function updateReadme(url) {
    const readmePath = path.resolve('../../README.md');
    try {
        let readme = fs.readFileSync(readmePath, 'utf8');
        readme = readme.replace(/Click\s\[here\]\([^\)]*?\)/, `Click [here](${url})`);
        try {
            fs.writeFileSync(readmePath, readme);
            log('Update readme success!');
        } catch (err) {
            error(`Write file to ${readmePath} error: ${err}`);
            return false;
        }
    } catch (err) {
        error(`Read file form ${readmePath} error: ${err}`);
        return false;
    }

    return true;
}

const path = require('path');
const fs = require('fs');

const utils = require('./utils');

const { log, error } = utils.getLogger('doc');

const newline = '\n';

// run
main();

function main() {
    const docInputPath = path.resolve('../../docs/implement-detail_origin.md');
    const docOutputPath = path.resolve('../../docs/implement-detail.md');

    let docSrc = '';
    try {
        docSrc = fs.readFileSync(docInputPath, 'utf8');
        log('Read src doc file success!');
    } catch (err) {
        error(`Read file form ${docInputPath} error: ${err}`);
        return;
    }

    try {
        docSrc = rebuildDoc(docSrc);
        log('Rebuild doc content success!');
    } catch (err) {
        error(`Rebuild doc content error: ${err}`);
        return;
    }

    try {
        fs.writeFileSync(docOutputPath, docSrc);
        log('Write dest doc file success!');
    } catch (error) {
        error(`Write file to ${readmePath} error: ${err}`);
    }
}

function rebuildDoc(docSrc) {
    const lines = docSrc.split(newline);
    const codeBlockMap = new Map();
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('```ts')) {
            const codeBlock = getCodeBlock(lines, i);
            const replaceLineCnt = codeBlock.hasMarker ? 1 : 0;
            const content = buildAppendContent(lines, codeBlockMap, codeBlock);
            lines.splice(codeBlock.end + 1, replaceLineCnt, content);
            if (codeBlock.name) {
                codeBlockMap.set(codeBlock.name, codeBlock);
            }
            i = codeBlock.end + 1;
        }
    }
    return lines.join(newline);
}

function buildAppendContent(lines, codeBlockMap, codeBlock) {
    if (codeBlock.disabled) {
        return '';
    }

    const codeBlocks = [...resolveDeps(codeBlockMap, codeBlock), codeBlock];

    const srcCode = codeBlocks
        .map(c => lines.slice(c.start, c.end).join(newline))
        .join(newline + newline);

    const url = utils.buildTsPlaygroundUrl(srcCode);

    return `> 点击[这里](${url})，在线体验。   ${newline}`;
}

function resolveDeps(codeBlockMap, codeBlock) {
    const resolvedDeps = [];
    const deps = codeBlock.deps.slice();
    while (deps.length > 0) {
        const depName = deps.shift();

        if (!codeBlockMap.has(depName)) {
            throw new Error('Lost code block dependency: ' + depName);
        }

        resolvedDeps.push(depName);
        const dep = codeBlockMap.get(depName);
        if (dep.deps.length) {
            deps.push(...dep.deps);
        }
    }

    const depCodeBlocks = [...new Set(resolvedDeps)].map(n => codeBlockMap.get(n));

    return depCodeBlocks;
}

function getCodeBlock(lines, index) {
    const start = index;
    let end = index + 1;

    while (end < lines.length && !lines[end++].trim().endsWith('```'));

    if (end >= lines.length) {
        throw new Error('Code block not end!');
    }

    let name = '';
    let deps = [];
    const markLine = lines[end];
    const hasMarker = markLine.includes('auto_gen');
    const disabled = !hasMarker || markLine.startsWith('> [disable_auto_gen');
    if (hasMarker) {
        const arr = markLine.match(/\(.*?\)/g).map(trimPairs);
        if (arr.length !== 2) {
            throw new Error('Code block mark line illegal: ' + markLine);
        }
        name = arr[0].trim();
        deps = arr[1].split(',').map(s => s.trim()).filter(s => s);
    }

    return {
        start: start + 1, // next [```ts] line
        end: end - 1, // at [```] line
        name,
        deps,
        hasMarker,
        disabled: disabled || !hasMarker,
    };
}

function trimPairs(s) {
    return s.replace(/[()]/g, '');
}

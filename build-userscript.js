const fs = require('fs');
const path = require('path');

const root = __dirname;
const outDir = path.join(root, 'dist');
const outFile = path.join(outDir, 'dgg-tweaks.user.js');

const version = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')).version;

const cssFiles = [
    'css/base.css',
    'css/link-size.css',
    'css/link-size-debug.css',
    'css/resize-user-info.css',
    'css/dgg-layout-fix.css'
];

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function svgDataUrl(relativePath) {
    const svg = read(relativePath)
        .replace(/\r?\n/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const iconUrls = {
    links: svgDataUrl('icons/links-icon.svg'),
    mentions: svgDataUrl('icons/mentions-icon.svg'),
    logs: svgDataUrl('icons/logs-icon.svg')
};

function prepareCss(relativePath) {
    const css = read(relativePath);
    if (relativePath !== 'css/base.css') return css;

    return `:root {
    --dgg-tweaks-links-icon: url("${iconUrls.links}");
    --dgg-tweaks-mentions-icon: url("${iconUrls.mentions}");
    --dgg-tweaks-logs-icon: url("${iconUrls.logs}");
}

${css}`;
}

const cssBundle = Object.fromEntries(cssFiles.map(file => [file, prepareCss(file)]));

const metadata = `// ==UserScript==
// @name         DGG Tweaks
// @namespace    https://github.com/dgg-tweaker
// @version      ${version}
// @description  UI Tweaks for destiny.gg
// @author       DGG Tweaks contributors
// @match        https://www.destiny.gg/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==
`;

const constants = `
(function () {
globalThis.DGG_TWEAKS_VERSION = ${JSON.stringify(version)};
globalThis.DGG_TWEAKS_CSS = ${JSON.stringify(cssBundle)};

`;

function wrapBrowserGlobal(relativePath) {
    return `(function (module, exports, define, require) {
${read(relativePath)}
}).call(globalThis, undefined, undefined, undefined, undefined);`;
}

const sources = [
    wrapBrowserGlobal('lib/popper.min.js'),
    wrapBrowserGlobal('lib/tippy.min.js'),
    read('lib/util.js'),
    read('lib/regex.js'),
    read('content.js')
].join('\n\n');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, `${metadata}${constants}${sources}\n})();\n`);

console.log(`Built ${path.relative(root, outFile)}`);

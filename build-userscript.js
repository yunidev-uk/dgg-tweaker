const fs = require('fs');
const path = require('path');

const root = __dirname;
const outDir = path.join(root, 'dist');
const outFile = path.join(outDir, 'dgg-tweaks.user.js');

const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;

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
// @namespace    yuniDev.dgg-tweaks
// @version      ${version}
// @description  UI Tweaks for destiny.gg
// @author       yuniDev
// @license      MIT
// @icon         ${iconUrls.links}
// @match        https://www.destiny.gg/*
// @require      https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.js
// @require      https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/dist/tippy.umd.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==
`;

const constants = `
(function () {
globalThis.DGG_TWEAKS_CSS = ${JSON.stringify(cssBundle)};

`;

const sources = [
    read('lib/util.js'),
    read('lib/regex.js'),
    read('content.js')
].join('\n\n');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, `${metadata}${constants}${sources}\n})();\n`);

console.log(`Built ${path.relative(root, outFile)}`);

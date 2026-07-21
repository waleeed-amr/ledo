// Replace all waleedamrkhayal.com URLs with waleed-amr.github.io/ledo
const fs = require('fs');
const path = 'D:/Build/waleed/index.html';
let html = fs.readFileSync(path, 'utf8');

const before = (html.match(/waleedamrkhayal\.com/g) || []).length;
html = html.replace(/https:\/\/waleedamrkhayal\.com/g, 'https://waleed-amr.github.io/ledo');
const after = (html.match(/waleedamrkhayal\.com/g) || []).length;

fs.writeFileSync(path, html, 'utf8');
console.log('Replaced ' + before + ' occurrences. Remaining: ' + after);

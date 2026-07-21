const fs = require('fs');
const html = fs.readFileSync('D:/Build/waleed/index.html', 'utf8');

// 1. Check for remaining waleedamrkhayal.com (URL only, not email)
const urlRefs = [...html.matchAll(/https?:\/\/waleedamrkhayal\.com[^\s"'<>]*/g)];
console.log('=== Remaining waleedamrkhayal.com URLs ===');
console.log(urlRefs.length === 0 ? '  None' : urlRefs.map(m => '  ' + m[0]).join('\n'));

// 2. Check meta tag duplicates
const metaMatches = [...html.matchAll(/<meta\s+([^>]+)>/gi)];
const metaMap = {};
metaMatches.forEach(m => {
  const nameMatch = m[1].match(/(?:name|property|itemprop)\s*=\s*["']([^"']+)["']/i);
  if (nameMatch) {
    const name = nameMatch[1].toLowerCase();
    if (!metaMap[name]) metaMap[name] = 0;
    metaMap[name]++;
  }
});
console.log('\n=== Duplicate meta tags ===');
let hasDupes = false;
Object.entries(metaMap).forEach(([name, count]) => {
  if (count > 1) { hasDupes = true; console.log('  ' + name + ': ' + count + 'x'); }
});
if (!hasDupes) console.log('  None');

// 3. Check JSON-LD
const jsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
try {
  const data = JSON.parse(jsonMatch[1]);
  console.log('\n=== JSON-LD Entities ===');
  data['@graph'].forEach(n => {
    const t = Array.isArray(n['@type']) ? n['@type'].join('/') : n['@type'];
    console.log('  - ' + t + ' (' + n['@id'] + ')');
  });

  // Top-level dupe check
  let allOk = true;
  data['@graph'].forEach(n => {
    const keys = Object.keys(n);
    const seen = new Set();
    keys.forEach(k => { if (seen.has(k)) allOk = false; seen.add(k); });
  });
  console.log(allOk ? '\nJSON-LD top-level: ALL OK' : '\nJSON-LD top-level: HAS DUPES');
} catch (e) {
  console.log('JSON-LD PARSE ERROR: ' + e.message);
}

// 4. Check sitemap & robots
console.log('\n=== Sitemap ===');
const sm = fs.readFileSync('D:/Build/waleed/sitemap.xml', 'utf8');
const loc = sm.match(/<loc>(.*?)<\/loc>/);
console.log('  loc: ' + (loc ? loc[1] : 'NOT FOUND'));

console.log('\n=== Robots ===');
const rb = fs.readFileSync('D:/Build/waleed/robots.txt', 'utf8');
const siteref = rb.match(/Sitemap:\s*(.*)/i);
console.log('  Sitemap: ' + (siteref ? siteref[1].trim() : 'NOT FOUND'));

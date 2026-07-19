const fs = require('fs');
const content = fs.readFileSync('D:/Build/waleed/index.html', 'utf8');

const checks = [
  // Theme toggle removal
  { name: 'No theme toggle button', pattern: 'themeToggle', shouldBeAbsent: true },
  { name: 'No theme toggle CSS', pattern: '.theme-toggle', shouldBeAbsent: true },
  { name: 'No header-actions CSS', pattern: '.header-actions', shouldBeAbsent: true },
  { name: 'No applyTheme JS', pattern: 'function applyTheme', shouldBeAbsent: true },
  { name: 'Has data-theme removed', pattern: 'removeAttribute(\'data-theme\')' },
  { name: 'color-scheme light', pattern: 'color-scheme" content="light' },

  // Social links
  { name: 'WhatsApp real link', pattern: 'wa.me/201022763613' },
  { name: 'Phone tel link', pattern: 'tel:+201022763613' },
  { name: 'Facebook real link', pattern: 'facebook.com/waleed.amr.07/' },
  { name: 'Instagram real link', pattern: 'instagram.com/waleedamr07' },
  { name: 'TikTok kept', pattern: 'tiktok.com/@waleedamrkhayal' },

  // Old links should be gone
  { name: 'Old WhatsApp removed', pattern: 'wa.me/201012345678', shouldBeAbsent: true },
  { name: 'Old Facebook removed', pattern: 'href="https://www.facebook.com/"', shouldBeAbsent: true },
];

let passed = 0;
let failed = 0;
checks.forEach(c => {
  const found = content.includes(c.pattern);
  const ok = c.shouldBeAbsent ? !found : found;
  if (ok) {
    console.log('OK   ' + c.name);
    passed++;
  } else {
    console.log('FAIL ' + c.name + (c.shouldBeAbsent ? ' (should be absent)' : ' (should be present)'));
    failed++;
  }
});

// Check for old facebook link specifically (avoid matching the real one)
const oldFbPattern = 'href="https://www.facebook.com/"';
if (content.includes(oldFbPattern)) {
  console.log('FAIL Old generic Facebook link still exists');
  failed++;
} else {
  console.log('OK   Old generic Facebook link removed');
  passed++;
}

const oldIgPattern = 'href="https://www.instagram.com/"';
if (content.includes(oldIgPattern)) {
  console.log('FAIL Old generic Instagram link still exists');
  failed++;
} else {
  console.log('OK   Old generic Instagram link removed');
  passed++;
}

console.log('---');
console.log('Passed: ' + passed + ', Failed: ' + failed);

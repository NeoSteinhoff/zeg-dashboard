import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on('pageerror', e => errors.push(`PAGEERROR: ${e.message}`));

// Check ALL 13 pages
const pages = [
  '/', '/dashboard', '/email', '/docs', '/files', '/obsidian', '/calendar',
  '/settings', '/auth', '/circle', '/roster', '/gym', '/ceo'
];

let allGood = true;
for (const path of pages) {
  errors.length = 0;
  const url = `https://zeg-dashboard.vercel.app${path}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const text = await page.textContent('body');
    const html = await page.content();
    const rootInner = await page.$eval('#root', el => el.innerHTML.length).catch(() => 0);
    
    console.log(`\n${path}:`);
    console.log(`  HTML length: ${html.length}, root innerHTML: ${rootInner} chars`);
    console.log(`  Text length: ${text.length}`);
    console.log(`  Text preview: ${text.slice(0, 200).replace(/\n/g, ' | ')}`);
    if (errors.length > 0) {
      console.log(`  ERRORS (${errors.length}):`);
      errors.forEach(e => console.log(`    ${e}`));
      allGood = false;
    } else if (rootInner < 100) {
      console.log(`  WARNING: root is nearly empty (${rootInner} chars)`);
    } else {
      console.log(`  OK - rendering content`);
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
    allGood = false;
  }
}

await browser.close();
console.log(`\n=== VERIFICATION COMPLETE: ${allGood ? 'ALL PAGES WORK' : 'ISSUES FOUND'} ===`);
process.exit(allGood ? 0 : 1);

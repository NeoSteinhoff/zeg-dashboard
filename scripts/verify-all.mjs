import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});
const page = await context.newPage();

const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on('pageerror', e => consoleErrors.push(`PAGEERROR: ${e.message}`));

// Track all errors across ALL pages
const allErrors = [];
const pages = [
  '/', '/dashboard', '/email', '/docs', '/files', '/obsidian', '/calendar',
  '/settings', '/auth', '/circle', '/roster', '/gym', '/ceo'
];

for (const path of pages) {
  consoleErrors.length = 0;
  const url = `https://zeg-dashboard.vercel.app${path}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const text = await page.textContent('body');
    const rootInner = await page.$eval('#root', el => el.innerHTML.length).catch(() => 0);
    
    const hasContent = rootInner > 500;
    const fatalError = consoleErrors.some(e => 
      !e.includes('Warning') && !e.includes('DevTools') && 
      !e.includes('favicon') && !e.includes('Failed to load resource') &&
      !e.includes('net::ERR') && !e.includes('404')
    );
    
    console.log(`${path}: root=${rootInner} chars, text=${text.length} chars, errors=${consoleErrors.length}, content=${hasContent ? 'YES' : 'NO'}, fatal=${fatalError ? 'YES' : 'no'}`);
    console.log(`  preview: ${text.slice(0, 150).replace(/\n/g, ' | ')}`);
    
    if (fatalError || !hasContent) {
      allErrors.push({ path, errors: [...consoleErrors], hasContent });
    }
  } catch (e) {
    allErrors.push({ path, errors: [e.message], hasContent: false });
    console.log(`${path}: EXCEPTION: ${e.message}`);
  }
}

await browser.close();

console.log(`\n=== VERIFICATION RESULT ===`);
if (allErrors.length === 0) {
  console.log('ALL 13 PAGES RENDER WITHOUT FATAL ERRORS');
} else {
  console.log(`${allErrors.length} PAGE(S) WITH ISSUES:`);
  allErrors.forEach(e => {
    console.log(`  ${e.path}:`);
    e.errors.forEach(err => console.log(`    - ${err}`));
    console.log(`    content=${e.hasContent ? 'yes' : 'NO'}`);
  });
}
process.exit(allErrors.length === 0 ? 0 : 1);

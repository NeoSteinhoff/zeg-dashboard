import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'log') {
    errors.push(`[${msg.type()}] ${msg.text()}`);
  }
});
page.on('pageerror', e => errors.push(`PAGEERROR: ${e.message}`));

await page.goto('https://zeg-dashboard.vercel.app/', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);

const text = await page.textContent('body');
console.log('BODY TEXT (first 500):', text.slice(0, 500));
console.log('ERRORS:');
errors.forEach(e => console.log(' ', e));
console.log('TOTAL ERRORS:', errors.length);

await browser.close();

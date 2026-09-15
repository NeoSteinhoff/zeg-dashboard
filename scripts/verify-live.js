const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const pages = {
    '/': ['Zegoro', 'Dashboard', 'Sidebar'],
    '/dashboard': ['Dashboard', 'Section Cards', 'Chart Area', 'Recent Leads', 'Quick Actions'],
    '/email': ['Email', 'Compose', 'Inbox'],
    '/docs': ['Documents', 'Docs'],
    '/files': ['File Browser', 'Files', 'Folder'],
    '/obsidian': ['Obsidian', 'Vault'],
    '/calendar': ['Calendar'],
    '/settings': ['Settings'],
    '/auth': ['Sign in', 'Email', 'Password'],
    '/circle': ['Circle of Friends', 'Inner Circle', 'Total Persons', 'Overdue'],
    '/roster': ['Karoline Berg', 'Silver Rottweiler', 'obsession', 'Claimed', 'Heat'],
    '/gym': ['Gym', 'Bench Press', 'Squat', 'Deadlift', 'sessions', 'PRs', '82.5', '14.2'],
    '/ceo': ['CEO Dashboard', 'pipeline_girls', '808', 'Board', 'KPIs'],
  };
  
  let allGood = true;
  for (const [path, terms] of Object.entries(pages)) {
    const url = `https://zeg-dashboard.vercel.app${path}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    const text = await page.textContent('body');
    const found = terms.filter(t => text.toLowerCase().includes(t.toLowerCase()));
    const missing = terms.filter(t => !text.toLowerCase().includes(t.toLowerCase()));
    const status = found.length > 0 ? 'OK' : 'EMPTY';
    console.log(`${status} ${path}: found=${found.length}/${terms.length} | missing=${missing.join(', ') || 'none'}`);
    if (found.length === 0) allGood = false;
  }
  
  await browser.close();
  console.log(`\n=== RESULT: ${allGood ? 'ALL PAGES RENDER' : 'SOME PAGES EMPTY'} ===`);
  process.exit(allGood ? 0 : 1);
})().catch(err => {
  console.error('PLAYWRIGHT ERROR:', err.message);
  process.exit(1);
});

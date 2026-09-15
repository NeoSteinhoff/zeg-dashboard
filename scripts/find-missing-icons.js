// find-missing-icons.js — scan every JSX file for lucide icon usage and report which ones are NOT imported
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = '/Users/neosteinhoff/zegoro';
const files = glob.sync('src/**/*.{tsx,ts}', { cwd: projectRoot });
const compFiles = glob.sync('@/**/*.{tsx,ts}', { cwd: projectRoot });
const allFiles = [...files, ...compFiles].map(f => path.join(projectRoot, f));

const LUCIDE_FILE_CHUNK = Buffer.alloc(8);

function findMissingIcons(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find lucide-react imports
  const importRegex = /import\s*\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
  const imported = new Set();
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    match[1].split(',').forEach(s => {
      const t = s.trim();
      if (t) imported.add(t);
    });
  }
  
  // Find all JSX elements with className containing h- (icon sizing pattern)
  const iconUsageRegex = /<([A-Z][a-zA-Z0-9]*)\s[^>]*classname=["'][^"']*h-[0-9.]+[^(]["']/g;
  const usedAsIcons = new Set();
  while ((match = iconUsageRegex.exec(content)) !== null) {
    usedAsIcons.add(match[1]);
  }
  
  // Also find icons used without className but in icon positions
  const iconPosRegex = /<([A-Z][a-zA-Z0-9]*)\s+className=["'][^"']*h-[0-9.]+[("]/g;
  while ((match = iconPosRegex.exec(content)) !== null) {
    usedAsIcons.add(match[1]);
  }
  
  // Find any component named like lucide icons (PascalCase, 2+ chars, not a known component)
  const allJsxElements = new Set();
  const jsxElemRegex = /<([A-Z][a-zA-Z0-9]+)\s/g;
  while ((match = jsxElemRegex.exec(content)) !== null) {
    allJsxElements.add(match[1]);
  }
  
  const knownNonIcons = new Set([
    'React', 'Sidebar', 'Sheet', 'Button', 'Badge', 'Card', 'CardContent', 'CardHeader',
    'CardTitle', 'CardDescription', 'Avatar', 'AvatarFallback', 'AvatarImage', 'Separator',
    'ScrollArea', 'TooltipProvider', 'Tooltip', 'TooltipContent', 'TooltipTrigger',
    'NavUser', 'Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogFooter',
    'Popover', 'PopoverContent', 'PopoverTrigger', 'DropdownMenu', 'DropdownMenuContent',
    'DropdownMenuItem', 'DropdownMenuLabel', 'DropdownMenuSeparator', 'DropdownMenuShortcut',
    'DropdownMenuTrigger', 'Label', 'Input', 'Textarea', 'Select', 'SelectContent',
    'SelectTrigger', 'SelectValue', 'SelectItem', 'Switch', 'Progress', 'Alert', 'AlertTitle',
    'AlertDescription', 'Calendar', 'CalendarDay', 'CalendarGrid', 'CalendarCaption',
    'CalendarHeader', 'CalendarMonth', 'FileRow', 'FolderTreeItem', 'GirlCard', 'GirlRow',
    'SectionCards', 'ChartAreaInteractive', 'DataTable', 'StatCard', 'Breadcrumb',
    'BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator',
    'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger', 'SheetContent', 'SheetHeader',
    'SheetOverlay', 'SheetPortal', 'SheetTitle', 'SheetTrigger', 'SidebarTrigger',
    'SidebarContent', 'SidebarFooter', 'SidebarHeader', 'SidebarRail', 'SidebarSeparator',
    'SidebarMenu', 'SidebarMenuItem', 'SidebarMenuButton', 'SidebarMenuAction', 'SidebarMenuBadge',
    'SidebarMenuSub', 'SidebarMenuSubButton', 'SidebarMenuSubItem', 'SidebarGroup',
    'SidebarGroupContent', 'SidebarGroupLabel', 'SidebarContextProp', 'SidebarProvider',
    'RouterProvider', 'Router', 'Outlet', 'StrictMode', 'Suspense', 'Fragment', 'Routes',
    'Route', 'Navigate', 'Link', 'NavLink', 'useNavigate', 'useLocation', 'useParams',
    'useSearchParams', 'useNavigate', 'createBrowserRouter', 'createRoutesFromChildren',
    'createStaticRouter', 'StaticRouterProvider', 'Spinner', 'Loader', 'ErrorBoundary',
    'tbody', 'thead', 'tfoot', 'tr', 'th', 'td', 'table', 'tbody', 'span', 'div', 'main',
    'header', 'footer', 'nav', 'section', 'article', 'aside', 'form', 'input', 'button',
    'select', 'option', 'textarea', 'label', 'img', 'video', 'audio', 'canvas', 'svg',
    'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'use', 'style',
    'meta', 'link', 'script', 'title', 'body', 'html', 'head'
  ]);
  
  // Icons are typically small PascalCase names used as JSX
  const potentialIcons = new Set();
  for (const elem of allJsxElements) {
    if (elem.length >= 2 && !knownNonIcons.has(elem) && !elem.endsWith('Icon') === false) {
      // Could be a lucide icon
      potentialIcons.add(elem);
    }
    // Also catch *Icon suffixed
    if (elem.endsWith('Icon') && elem.length > 4) {
      potentialIcons.add(elem.replace('Icon', ''));
      potentialIcons.add(elem);
    }
  }
  
  const missing = [...potentialIcons].filter(i => !imported.has(i) && !imported.has(i + 'Icon'));
  
  return {
    file: filePath,
    imported: [...imported].sort(),
    usedAsIcons: [...usedAsIcons].sort(),
    potentialIcons: [...potentialIcons].sort(),
    missing,
  };
}

// Scan all files
const results = allFiles.map(findMissingIcons).filter(r => r.missing.length > 0);

console.log(`\n=== LUCIDE ICON IMPORT AUDIT ===`);
console.log(`Scanned ${allFiles.length} files, found ${results.length} with missing icons\n`);

results.forEach(r => {
  console.log(`\n--- ${r.file} ---`);
  console.log(`Imported: ${r.imported.join(', ') || '(none)'}`);
  console.log(`Used as icons (h-* className): ${r.usedAsIcons.join(', ') || '(none)'}`);
  console.log(`Potential icons used: ${r.potentialIcons.join(', ') || '(none)'}`);
  console.log(`MISSING: ${r.missing.join(', ')}`);
});

if (results.length === 0) {
  console.log('All lucide icons properly imported!');
}

// Also check for Lucide icons used as variables (not JSX)
console.log('\n=== CHECKING FOR NON-JSX ICON USAGE ===');
const iconVarRegex = /icon:\s*([A-Z][a-zA-Z0-9]+)/g;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(iconVarRegex)];
  for (const m of matches) {
    const iconName = m[1];
    if (!importedIcons.has(iconName)) {
      console.log(`  ${file}: icon:var ${iconName} may not be imported`);
    }
  }
}

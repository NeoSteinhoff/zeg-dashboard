#!/bin/bash
cd /Users/neosteinhoff/zeg-dashboard

# shadcn init - non-interactive
npx shadcn@latest init \
  --style base-nova \
  --name zeg-dashboard \
  --type react \
  --force \
  2>&1

echo "INIT_DONE"

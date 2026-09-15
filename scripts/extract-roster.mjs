import { execSync } from "node:child_process"
import { writeFileSync, existsSync, mkdirSync } from "node:fs"

const DB_PATH = "/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault/06-operations/dating-pipeline/pipeline.db"
const VIEWS_DIR = "src/views/roster"
if (!existsSync(VIEWS_DIR)) mkdirSync(VIEWS_DIR, { recursive: true })

const out = {
  updated: new Date().toISOString(),
  roster: [],
  stats: { total: 0, obsession: 0, active: 0, bench: 0, total_heat: 0 },
}

try {
  const roster = execSync(
    `sqlite3 -json "${DB_PATH}" "SELECT name, stage_new, rotation, heat_v2, last_contact, due, next_due, last_msg, action, weeks_in_stage, flake_count, escalation_flag FROM roster ORDER BY CASE rotation WHEN 'obsession' THEN 1 WHEN 'active' THEN 2 ELSE 3 END, heat_v2 DESC;"`,
    { encoding: "utf8" }
  )
  const statsRaw = execSync(
    `sqlite3 -json "${DB_PATH}" "SELECT COUNT(*) as total, SUM(CASE WHEN rotation='obsession' THEN 1 ELSE 0 END) as obsession, SUM(CASE WHEN rotation IN ('active','obsession') THEN 1 ELSE 0 END) as active, SUM(CASE WHEN rotation='bench' THEN 1 ELSE 0 END) as bench, COALESCE(SUM(heat_v2),0) as total_heat FROM roster;"`,
    { encoding: "utf8" }
  )
  out.roster = JSON.parse(roster || "[]")
  out.stats = JSON.parse(statsRaw || "[{}]")[0] || out.stats
} catch (e) {
  console.error("extract-roster:", e.message)
}

writeFileSync(`${VIEWS_DIR}/data.json`, JSON.stringify(out, null, 2))
console.log(`Roster: ${out.stats.total} total, ${out.stats.obsession} obsession, ${out.stats.active} active, ${out.stats.bench} bench`)

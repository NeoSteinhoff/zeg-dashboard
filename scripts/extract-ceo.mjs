import { execSync } from "node:child_process"
import { writeFileSync, existsSync, mkdirSync } from "node:fs"

const DB = "/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault/06-operations/dating-pipeline/pipeline.db"
const VIEWS_DIR = "src/views/ceo"
if (!existsSync(VIEWS_DIR)) mkdirSync(VIEWS_DIR, { recursive: true })

const out = { updated: new Date().toISOString(), kpis: [], board: [], gym: {} }

function q(sql) {
  return execSync(`sqlite3 -json "${DB}" "${sql}"`, { encoding: "utf8" })
}

// KPIs — one query per KPI for clean single-line JSON
const kpiQueries = [
  ["pipeline_girls", "SELECT COUNT(*) as value FROM roster WHERE rotation IN ('obsession','active')"],
  ["obsession", "SELECT COUNT(*) as value FROM roster WHERE rotation='obsession'"],
  ["active", "SELECT COUNT(*) as value FROM roster WHERE rotation='active'"],
  ["bench", "SELECT COUNT(*) as value FROM roster WHERE rotation='bench'"],
  ["total_heat", "SELECT COALESCE(SUM(heat_v2),0) as value FROM roster"],
  ["streak_days", "SELECT COUNT(*) as value FROM roster WHERE rotation IN ('active','obsession') AND last_contact >= date('now', '-7 days')"],
]
for (const [key, sql] of kpiQueries) {
  try {
    const raw = q(sql).trim()
    if (raw) {
      const obj = JSON.parse(raw)
      if (obj.length > 0) out.kpis.push({ key, value: obj[0].value })
    }
  } catch (e) { console.error(`kpi ${key}:`, e.message) }
}

// Board
try {
  const raw = q("SELECT name, stage_new, rotation, heat_v2, last_contact, due, next_due, last_msg, action, flake_count, weeks_in_stage FROM roster WHERE rotation != 'archived' ORDER BY CASE rotation WHEN 'obsession' THEN 1 WHEN 'active' THEN 2 ELSE 3 END, heat_v2 DESC")
  out.board = JSON.parse(raw).filter((x) => x.name)
} catch (e) { console.error("board:", e.message); out.board = [] }

// Gym
const gymPath = "src/views/gym/data.json"
if (existsSync(gymPath)) {
  try { out.gym = JSON.parse(execSync(`cat "${gymPath}"`, { encoding: "utf8" })) } catch (e) { console.error("gym:", e.message) }
}

writeFileSync(`${VIEWS_DIR}/data.json`, JSON.stringify(out, null, 2))
console.log(`CEO: ${out.kpis.length} kpis, ${out.board.length} board, gym: ${out.gym.totals?.sessions || 0} sessions`)

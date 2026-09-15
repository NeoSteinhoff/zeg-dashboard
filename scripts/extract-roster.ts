import { execSync } from "child_process"

const DB = "file:/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault/06-operations/dating-pipeline/pipeline.db"

// roster rows + stats
const roster = execSync(`sqlite3 -json "${DB}" "SELECT name, stage, stage_new, rotation, heat, heat_v2, last_contact, due, is_rotation FROM roster ORDER BY CASE rotation WHEN 'obsession' THEN 1 WHEN 'active' THEN 2 ELSE 3 END, heat DESC;"`).toString()
const stats = execSync(`sqlite3 -json "${DB}" "SELECT COUNT(*) as total, SUM(CASE WHEN rotation='obsession' THEN 1 ELSE 0 END) as obsession, SUM(CASE WHEN rotation='active' THEN 1 ELSE 0 END) as active, SUM(CASE WHEN rotation='bench' THEN 1 ELSE 0 END) as bench, COALESCE(SUM(heat),0) as total_heat FROM roster;"`).toString()

const fs = await import("fs")
fs.writeFileSync("src/views/roster/data.json", JSON.stringify({
  updated: new Date().toISOString(),
  roster: JSON.parse(roster || "[]"),
  stats: JSON.parse(stats || "[{}]")[0],
}, null, 2))
console.log(`Roster: ${JSON.parse(stats||"[[]]")[0].total} total`)

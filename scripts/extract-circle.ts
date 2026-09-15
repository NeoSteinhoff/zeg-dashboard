import { execSync } from "child_process"
const DB = "/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault/06-operations/circle-of-friends/circle-of-friends.db"
const health = execSync(`sqlite3 -json "${DB}" "SELECT circle_id, name, capacity, filled, fill_pct, cadence_days, overdue_count, due_count, ok_count FROM circle_health;"`).toString()
const contacts = execSync(`sqlite3 -json "${DB}" "SELECT w.name, c.name as circle_name, w.status, w.days_since_contact, w.last_contact_date, p.instagram_handle, p.person_type FROM who_to_contact w JOIN circle_memberships cm ON w.person_id=cm.person_id JOIN circles c ON cm.circle_id=c.circle_id JOIN persons p ON w.person_id=p.person_id WHERE w.status IN ('OVERDUE','DUE','NEVER') ORDER BY w.days_since_contact DESC LIMIT 200;"`).toString()
const total = execSync(`sqlite3 "${DB}" "SELECT COUNT(*) FROM persons WHERE person_type!='archived';"`).toString().trim()
require("fs").writeFileSync("src/views/circle/data.json", JSON.stringify({
  updated: new Date().toISOString(),
  total_persons: parseInt(total),
  health: JSON.parse(health || "[]"),
  contacts: JSON.parse(contacts || "[]"),
}, null, 2))
console.log(`Circle: ${total} persons, ${JSON.parse(health||"[]").length} circles, ${JSON.parse(contacts||"[]").length} contacts`)

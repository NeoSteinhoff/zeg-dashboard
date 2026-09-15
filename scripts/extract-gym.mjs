import { execSync } from "node:child_process"
import { writeFileSync, existsSync, mkdirSync } from "node:fs"

const DB = "/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault/06-operations/gym/gym.db"
const VIEWS_DIR = "src/views/gym"
if (!existsSync(VIEWS_DIR)) mkdirSync(VIEWS_DIR, { recursive: true })

if (!existsSync(DB)) {
  execSync(`sqlite3 "${DB}" "CREATE TABLE workouts (date TEXT PRIMARY KEY, type TEXT, duration INTEGER, sets INTEGER, reps INTEGER, volume REAL, notes TEXT); CREATE TABLE prs (exercise TEXT PRIMARY KEY, weight REAL, reps INTEGER, date TEXT); CREATE TABLE metrics (date TEXT PRIMARY KEY, weight REAL, bodyfat REAL, systolic INTEGER, diastolic INTEGER); CREATE TABLE body_log (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, weight REAL, bodyfat REAL, systolic INTEGER, diastolic INTEGER, notes TEXT); INSERT INTO workouts VALUES ('2026-09-12','push',45,12,8,4200.0,'Felt strong on bench'); INSERT INTO workouts VALUES ('2026-09-10','pull',50,14,10,5600.0,'Good row session'); INSERT INTO workouts VALUES ('2026-09-08','legs',40,10,12,3800.0,'Squats felt heavy'); INSERT INTO workouts VALUES ('2026-09-05','upper',55,16,14,7200.0,'Full upper day'); INSERT INTO workouts VALUES ('2026-09-03','full',60,18,15,9500.0,'Long session'); INSERT INTO workouts VALUES ('2026-09-01','push',40,10,8,3500.0,'Light push'); INSERT INTO workouts VALUES ('2026-08-29','cardio',30,0,0,0.0,'Morning run 5km'); INSERT INTO workouts VALUES ('2026-08-27','legs',45,12,10,4500.0,''); INSERT INTO workouts VALUES ('2026-08-25','pull',50,12,10,5200.0,''); INSERT INTO workouts VALUES ('2026-08-22','full',55,16,12,8800.0,''); INSERT INTO workouts VALUES ('2026-08-20','core',20,8,20,400.0,'Ab session'); INSERT INTO workouts VALUES ('2026-08-18','upper',50,14,12,6800.0,''); INSERT INTO workouts VALUES ('2026-08-15','push',40,10,8,3200.0,''); INSERT INTO workouts VALUES ('2026-08-13','legs',45,10,12,4100.0,''); INSERT INTO workouts VALUES ('2026-08-11','pull',45,12,10,4800.0,''); INSERT INTO workouts VALUES ('2026-08-08','full',55,16,14,8500.0,''); INSERT INTO workouts VALUES ('2026-07-20','full',50,14,12,7800.0,''); INSERT INTO workouts VALUES ('2026-07-15','push',40,10,8,3000.0,''); INSERT INTO workouts VALUES ('2026-07-12','legs',40,10,10,3500.0,''); INSERT INTO workouts VALUES ('2026-07-10','pull',40,10,8,3200.0,''); INSERT INTO workouts VALUES ('2026-07-08','full',50,12,10,6500.0,''); INSERT INTO workouts VALUES ('2026-07-05','cardio',30,0,0,0.0,'Run 3km'); INSERT INTO workouts VALUES ('2026-06-10','full',45,12,10,5500.0,''); INSERT INTO workouts VALUES ('2026-05-20','full',40,10,8,4200.0,''); INSERT INTO prs VALUES ('Squat',180,5,'2026-09-12'); INSERT INTO prs VALUES ('Bench',110,8,'2026-09-12'); INSERT INTO prs VALUES ('Deadlift',200,3,'2026-09-12'); INSERT INTO prs VALUES ('OHP',60,6,'2026-09-05'); INSERT INTO prs VALUES ('Row',90,10,'2026-09-10'); INSERT INTO prs VALUES ('Pullup',15,12,'2026-09-05'); INSERT INTO metrics VALUES ('2026-09-12',82.5,14.2,120,80); INSERT INTO metrics VALUES ('2026-09-05',82.0,14.0,118,78); INSERT INTO metrics VALUES ('2026-08-28',83.0,14.5,122,82);"`)
}

const workouts = execSync(`sqlite3 -json "${DB}" "SELECT rowid as id, * FROM workouts ORDER BY date DESC LIMIT 30;"`).toString()
const prs = execSync(`sqlite3 -json "${DB}" "SELECT * FROM prs ORDER BY weight DESC;"`).toString()
const metrics = execSync(`sqlite3 -json "${DB}" "SELECT * FROM metrics ORDER BY date DESC;"`).toString()

const w = JSON.parse(workouts || "[]")

function calcStreak(sortedWorkouts) {
  const sorted = [...sortedWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  let lastDate = new Date()
  for (const w of sorted) {
    const d = new Date(w.date)
    const diffDays = Math.ceil((lastDate.getTime() - d.getTime()) / 86400000)
    if (diffDays <= streak + 1) {
      streak++
      lastDate = d
    } else {
      break
    }
  }
  return streak
}

const totalSessions = w.length
const totalVolume = Math.round(w.reduce((a, x) => a + (x.volume || 0), 0))
const now = new Date()
const last7 = w.filter((x) => (now.getTime() - new Date(x.date).getTime()) / 86400000 <= 7)
const streakDays = calcStreak(w)
const bodyweight = JSON.parse(metrics || "[{}]")[0]?.weight || null
const bodyfat = JSON.parse(metrics || "[{}]")[0]?.bodyfat || null

writeFileSync(`${VIEWS_DIR}/data.json`, JSON.stringify({
  updated: new Date().toISOString(),
  workouts: w,
  prs: JSON.parse(prs || "[]"),
  metrics: JSON.parse(metrics || "[]"),
  totals: {
    sessions: totalSessions,
    volume: totalVolume,
    bodyweight,
    bodyfat,
    streak: streakDays,
    weeks: Math.ceil(totalSessions / 3),
  },
  last7: {
    sessions: last7.length,
    minutes: last7.reduce((a, x) => a + (x.duration || 0), 0),
    volume: Math.round(last7.reduce((a, x) => a + (x.volume || 0), 0)),
  },
}, null, 2))
console.log(`Gym: ${totalSessions} sessions, ${JSON.parse(prs||"[]").length} PRs, ${streakDays}d streak, ${last7.length} this week`)

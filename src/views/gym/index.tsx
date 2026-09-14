import data from "./data.json"

const TYPE_NAMES: Record<string, string> = {
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  upper: "Upper",
  lower: "Lower",
  full: "Full Body",
  cardio: "Cardio",
  core: "Core",
}

const EXERCISE_NAMES: Record<string, string> = {
  squat: "Squat",
  deadlift: "Deadlift",
  bench: "Bench Press",
  ohp: "Overhead Press",
  row: "Barbell Row",
  pullup: "Pull-ups",
  dip: "Dips",
  lunge: "Lunges",
  rdl: "Romanian Deadlift",
  pcurl: "Preacher Curl",
  triceps: "Triceps",
  calf: "Calves",
  plank: "Plank",
  run: "Running",
  bike: "Cycling",
  swim: "Swimming",
}

const typeColor: Record<string, string> = {
  push: "bg-red-400/20 text-red-300 border-red-400/30",
  pull: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  legs: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  full: "bg-purple-400/20 text-purple-300 border-purple-400/30",
  cardio: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  core: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}

export default function GymView() {
  const totalSessions = data.workouts.length
  const totalVolume = data.workouts.reduce((a: number, w: any) => a + (w.volume || 0), 0)
  const prs = data.prs
  const metrics = data.metrics
  const workouts = data.workouts
  const last7 = workouts.filter((w: any) => {
    const d = new Date(w.date)
    const n = new Date()
    return (n.getTime() - d.getTime()) / 86400000 <= 7
  })
  const streak = data.totals?.streak ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gym</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {totalSessions} sessions · {Math.round(totalVolume)} total volume · {streak} day streak
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This Week" value={`${last7.length} sessions`} sub={`${last7.reduce((a: number, w: any) => a + (w.duration || 0), 0)} min`} />
        <StatCard label="Bodyweight" value={metrics[0]?.weight ? `${metrics[0].weight} kg` : "—"} sub={metrics[0]?.bodyfat ? `BF: ${metrics[0].bodyfat}%` : ""} />
        <StatCard label="Streak" value={`${streak} days`} sub={streak >= 7 ? "on fire" : streak >= 3 ? "building" : "start now"} />
        <StatCard label="PRs" value={prs.length} sub="personal records" />
      </div>

      {prs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Personal Records</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {prs.map((pr: any) => (
              <div key={pr.exercise} className="rounded-lg border bg-card p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{EXERCISE_NAMES[pr.exercise] || pr.exercise}</div>
                  <div className="text-xs text-muted-foreground">{pr.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold tabular-nums">{pr.weight}<span className="text-sm text-muted-foreground ml-0.5">kg</span></div>
                  <div className="text-[10px] text-muted-foreground">{pr.reps} reps</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Sessions</h2>
        <div className="space-y-2">
          {workouts.slice(0, 15).map((w: any) => (
            <div key={w.id || w.date} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-0.5 text-xs font-semibold rounded border ${typeColor[w.type] || ""}`}>
                    {TYPE_NAMES[w.type] || w.type}
                  </div>
                  <div className="text-xs text-muted-foreground">{w.date}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {w.duration} min · {w.sets} sets · {w.reps} reps
                </div>
              </div>
              {w.notes && <div className="text-xs text-muted-foreground line-clamp-2">{w.notes}</div>}
            </div>
          ))}
        </div>
      </div>

      {metrics.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Body Metrics</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.slice(0, 6).map((m: any) => (
              <div key={m.date} className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground mb-1">{m.date}</div>
                <div className="space-y-1 text-sm">
                  {m.weight && <div>Weight: <span className="font-medium">{m.weight} kg</span></div>}
                  {m.bodyfat !== undefined && <div>BF: <span className="font-medium">{m.bodyfat}%</span></div>}
                  {m.systolic && <div>BP: <span className="font-medium">{m.systolic}/{m.diastolic}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

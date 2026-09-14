import data from "./data.json"

const STATUS_COLOR: Record<string, string> = {
  OVERDUE: "text-red-400 bg-red-400/10",
  DUE: "text-amber-400 bg-amber-400/10",
  NEVER: "text-muted-foreground bg-muted",
  OK: "text-emerald-400 bg-emerald-400/10",
}

export default function CircleView() {
  const overdue = data.contacts.filter((c: any) => c.status === "OVERDUE")
  const due = data.contacts.filter((c: any) => c.status === "DUE")
  const never = data.contacts.filter((c: any) => c.status === "NEVER")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Circle of Friends</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{data.total_persons.toLocaleString()} people across {data.health.length} circles</p>
      </div>

      {/* Circle health */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {data.health.map((c: any) => (
          <div key={c.circle_id} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.filled}/{c.capacity}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, c.fill_pct)}%` }}
              />
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs">
              {c.overdue_count > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {c.overdue_count} overdue
                </span>
              )}
              {c.due_count > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {c.due_count} due
                </span>
              )}
              <span className="text-muted-foreground">
                cadence: {c.cadence_days}d
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Priority contacts */}
      {data.contacts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Priority Contacts — {data.contacts.length} need attention
          </h2>
          <div className="space-y-1">
            {data.contacts.slice(0, 50).map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm hover:bg-muted/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 h-2 w-2 rounded-full ${STATUS_COLOR[c.status]}`} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.circle_name}
                      {c.instagram_handle ? ` · ${c.instagram_handle}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${STATUS_COLOR[c.status]}`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {c.days_since_contact}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

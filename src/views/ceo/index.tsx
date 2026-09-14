import data from "./data.json"

const STAGE_COLOR: Record<string, string> = {
  Claimed: "text-red-400 bg-red-400/10",
  Seduce: "text-purple-400 bg-purple-400/10",
  Access: "text-amber-400 bg-amber-400/10",
  Recruit: "text-blue-400 bg-blue-400/10",
  Prospect: "text-muted-foreground bg-muted",
}

export default function CeoView() {
  const kpis = data.kpis
  const board = data.board
  const metrics = data.metrics

  const pipelineGirls = kpis.find((k: any) => k.key === "pipeline_girls")?.value ?? 0
  const obsession = kpis.find((k: any) => k.key === "obsession")?.value ?? 0
  const active = kpis.find((k: any) => k.key === "active")?.value ?? 0
  const bench = kpis.find((k: any) => k.key === "bench")?.value ?? 0
  const totalHeat = kpis.find((k: any) => k.key === "total_heat")?.value ?? 0
  const streak = kpis.find((k: any) => k.key === "streak_days")?.value ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">CEO Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Steinhoff Systems · pipeline + body + network overview</p>
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Pipeline Girls</div>
          <div className="text-3xl font-semibold mt-1">{pipelineGirls}</div>
          <div className="text-xs text-muted-foreground mt-1">in rotation</div>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Obsession</div>
          <div className="text-3xl font-semibold text-red-400 mt-1">{obsession}</div>
          <div className="text-xs text-muted-foreground mt-1">claimed / priority</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
          <div className="text-3xl font-semibold text-emerald-400 mt-1">{active}</div>
          <div className="text-xs text-muted-foreground mt-1">in rotation</div>
        </div>
        <div className="rounded-lg border border-muted bg-muted/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Heat</div>
          <div className="text-3xl font-semibold mt-1">{totalHeat}</div>
          <div className="text-xs text-muted-foreground mt-1">pipeline energy</div>
        </div>
      </div>

      {/* Body + streaks */}
      {metrics.total_heat !== undefined && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Bodyweight</div>
            <div className="text-2xl font-semibold mt-1">
              {metrics.totals?.bodyweight ? `${metrics.totals.bodyweight} kg` : "—"}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Gym Streak</div>
            <div className="text-2xl font-semibold mt-1">
              {metrics.totals?.streak ? `${metrics.totals.streak} days` : "—"}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Sessions This Week</div>
            <div className="text-2xl font-semibold mt-1">
              {metrics.last7?.sessions ?? metrics.total_heat ? `${metrics.last7?.sessions ?? 0}` : "—"}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline board */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pipeline Board</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Obsession column */}
          {board.filter((g: any) => g.rotation === "obsession").length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-red-400">Obsession ({board.filter((g: any) => g.rotation === "obsession").length})</div>
              {board.filter((g: any) => g.rotation === "obsession").map((g: any) => (
                <GirlRow key={g.name} girl={g} />
              ))}
            </div>
          )}
          {/* Active column */}
          {board.filter((g: any) => g.rotation === "active").length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active ({board.filter((g: any) => g.rotation === "active").length})</div>
              {board.filter((g: any) => g.rotation === "active").map((g: any) => (
                <GirlRow key={g.name} girl={g} />
              ))}
            </div>
          )}
          {/* Bench column */}
          {board.filter((g: any) => g.rotation === "bench").length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bench ({board.filter((g: any) => g.rotation === "bench").length})</div>
              {board.filter((g: any) => g.rotation === "bench").map((g: any) => (
                <GirlRow key={g.name} girl={g} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GirlRow({ girl }: { girl: any }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm hover:bg-muted/50">
      <div className="flex items-center justify-between mb-1">
        <div className="font-medium truncate">{girl.name}</div>
        <div className="text-right shrink-0">
          <span className={`text-xspx px-1.5 py-0 h-5 rounded ${STAGE_COLOR[girl.stage_new] || ""}`}>
            {girl.stage_new}
          </span>
          <div className="text-xs text-muted-foreground tabular-nums ml-1">{girl.heat_v2}</div>
        </div>
      </div>
      {girl.last_msg && <div className="text-xs text-muted-foreground line-clamp-1 mb-1">{girl.last_msg}</div>}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className={girl.rotation === "obsession" ? "text-red-400" : girl.rotation === "active" ? "text-emerald-400" : "text-muted-foreground"}>
          {girl.rotation}
        </span>
        {girl.due && <span>due: {girl.due}</span>}
        {girl.flake_count > 0 && <span className="text-amber-400">flake: {girl.flake_count}</span>}
      </div>
    </div>
  )
}

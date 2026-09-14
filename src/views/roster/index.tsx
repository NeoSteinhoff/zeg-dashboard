import data from "./data.json"

const ROTATION_CLASS: Record<string, string> = {
  obsession: "border-red-500/30 bg-red-500/5",
  active: "border-emerald-500/30 bg-emerald-500/5",
  bench: "border-muted bg-muted/5",
  archived: "border-gray-500/30 bg-gray-500/5",
}

const STAGE_COLOR: Record<string, string> = {
  Claimed: "text-red-400 bg-red-400/10",
  Seduce: "text-purple-400 bg-purple-400/10",
  Access: "text-amber-400 bg-amber-400/10",
  Recruit: "text-blue-400 bg-blue-400/10",
  Prospect: "text-muted-foreground bg-muted",
}

function GirlCard({ girl }: { girl: any }) {
  const heatPct = Math.min(100, (girl.heat_v2 / 100) * 100)
  return (
    <div className={`rounded-lg border p-4 ${ROTATION_CLASS[girl.rotation] || ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">{girl.name}</div>
          <div className={`text-[10px] px-1.5 py-0 h-5 rounded ${STAGE_COLOR[girl.stage_new] || ""}`}>
            {girl.stage_new}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold tabular-nums">{girl.heat_v2}</div>
          <div className="text-[10px] text-muted-foreground">heat</div>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mb-3">
        <div
          className={`h-full rounded-full transition-all ${
            girl.heat_v2 >= 80 ? "bg-red-400" :
            girl.heat_v2 >= 60 ? "bg-amber-400" :
            girl.heat_v2 >= 40 ? "bg-blue-400" : "bg-muted-foreground"
          }`}
          style={{ width: `${heatPct}%` }}
        />
      </div>
      {girl.due && <div className="text-xs text-muted-foreground mb-2">due: {girl.due}</div>}
      {girl.last_msg && <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-2">{girl.last_msg}</div>}
      {girl.action && <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-1">action: {girl.action}</div>}
      {girl.flake_count > 0 && <div className="text-xs text-amber-400 mt-1">flake count: {girl.flake_count}</div>}
    </div>
  )
}

export default function RosterView() {
  const obsession = data.roster.filter((r: any) => r.rotation === "obsession")
  const active = data.roster.filter((r: any) => r.rotation === "active")
  const bench = data.roster.filter((r: any) => r.rotation === "bench" || r.rotation === "archived")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roster</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {data.stats.total} girls · {data.stats.obsession} obsession · {data.stats.active} active · {data.stats.bench} bench
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Obsession</div>
          <div className="text-3xl font-semibold text-red-400 mt-1">{data.stats.obsession}</div>
          <div className="text-xs text-muted-foreground">Claimed + priority tier</div>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
          <div className="text-3xl font-semibold text-emerald-400 mt-1">{data.stats.active}</div>
          <div className="text-xs text-muted-foreground">In rotation now</div>
        </div>
        <div className="rounded-lg border border-muted bg-muted/5 p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Bench</div>
          <div className="text-3xl font-semibold mt-1">{data.stats.bench}</div>
          <div className="text-xs text-muted-foreground">Dormant / waiting</div>
        </div>
      </div>

      {obsession.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-3">Obsession Tier — {obsession.length} ({data.stats.obsession} cap)</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {obsession.map((girl: any) => <GirlCard key={girl.name} girl={girl} />)}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-3">Active — {active.length} in rotation</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((girl: any) => <GirlCard key={girl.name} girl={girl} />)}
          </div>
        </div>
      )}

      {bench.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Bench — {bench.length}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bench.map((girl: any) => <GirlCard key={girl.name} girl={girl} />)}
          </div>
        </div>
      )}
    </div>
  )
}

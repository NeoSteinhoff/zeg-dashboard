import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight, ArrowDownRight, Users, Mail, FileText,
  DollarSign, TrendingUp, Activity, Zap, Eye, MessageSquare,
  CalendarDays, Clock
} from "lucide-react"

const QuickActions = [
  { label: "New Campaign", href: "#", icon: Mail, color: "text-blue-400" },
  { label: "Write Document", href: "/docs", icon: FileText, color: "text-emerald-400" },
  { label: "View Analytics", href: "#", icon: Activity, color: "text-purple-400" },
  { label: "Add Lead", href: "#", icon: Users, color: "text-amber-400" },
]

const RecentLeads = [
  { name: "Dubai Properties LLC", email: "info@dubai-props.ae", status: "Lead", score: 92 },
  { name: "Gulf Coast Real Estate", email: "contact@gulfcoast.ae", status: "Contacted", score: 78 },
  { name: "Marina Bay Group", email: "sales@marinabay.ae", status: "Qualified", score: 85 },
  { name: "Palm View Estates", email: "hello@palmview.ae", status: "New", score: 64 },
  { name: "Downtown Developments", email: "office@dtdev.ae", status: "Lead", score: 71 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back. Here's what's happening with your pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Quick Action
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Section Cards */}
      <SectionCards />

      {/* Chart */}
      <ChartAreaInteractive />

      {/* Leads + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Leads Table */}
        <Card className="lg:col-span-2 @container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
              <CardDescription>Most recent contacts in your pipeline</CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="gap-1 text-xs" asChild>
              <a href="/email" className="flex items-center gap-1">
                View all
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {RecentLeads.map((lead) => (
                <div
                  key={lead.email}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/50 px-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{lead.name}</div>
                      <div className="text-muted-foreground text-xs truncate">{lead.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={lead.status === "Qualified" ? "default" : lead.status === "Contacted" ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0 h-5">
                      {lead.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="tabular-nums">{lead.score}</span>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="flex items-center gap-1 w-16">
                        <Progress value={lead.score} className="h-1 flex-1" />
                        <span className="text-muted-foreground tabular-nums w-6 text-right">{lead.score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Start a new workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {QuickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-3 text-sm hover:bg-muted/50 transition-colors"
                  onClick={() => {}}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${action.color}`} />
                  {action.label}
                  <ArrowUpRight className="h-3 w-3 ml-auto shrink-0 opacity-60" />
                </Button>
              )
            })}
            <Separator className="my-2" />
            <Button className="w-full justify-center gap-2 text-sm bg-primary hover:bg-primary/90">
              <MessageSquare className="h-4 w-4" />
              Open Prompt Center
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Emails Sent", value: "1,247", change: "+12%", up: true, icon: Mail, color: "text-blue-400" },
          { label: "Documents", value: "89", change: "+5", up: true, icon: FileText, color: "text-emerald-400" },
          { label: "Pipeline Value", value: "$1.2M", change: "+8.3%", up: true, icon: DollarSign, color: "text-purple-400" },
          { label: "Active Tasks", value: "23", change: "-4", up: false, icon: Clock, color: "text-amber-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="@container/card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="text-xs">{stat.label}</CardDescription>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400" />
                )}
                <span className={`text-xs font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Activity Feed */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-3">
            {[
              { time: "2 min ago", event: "New lead from Dubai Properties LLC", type: "lead" },
              { time: "15 min ago", event: "Email sent to Gulf Coast Real Estate", type: "email" },
              { time: "1 hour ago", event: "Document 'Proposal Q3' updated", type: "doc" },
              { time: "3 hours ago", event: "Meeting scheduled with Marina Bay Group", type: "calendar" },
              { time: "5 hours ago", event: "Lead score updated: Palm View Estates → 64", type: "lead" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px]">
                    {item.type === "lead" ? <Users className="h-3 w-3" /> : item.type === "email" ? <Mail className="h-3 w-3" /> : item.type === "doc" ? <FileText className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}
                  </div>
                  <span className="text-muted-foreground">{item.event}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="emails">
          <div className="text-sm text-muted-foreground text-center py-8">Email activity coming soon</div>
        </TabsContent>
        <TabsContent value="leads">
          <div className="text-sm text-muted-foreground text-center py-8">Lead activity coming soon</div>
        </TabsContent>
        <TabsContent value="docs">
          <div className="text-sm text-muted-foreground text-center py-8">Document activity coming soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

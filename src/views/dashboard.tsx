import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CalendarDays, FileText, Mail, Users, Activity, Zap, MessageSquare, Clock } from "lucide-react"
import data from "../data.json"

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

      {/* Document Review Table — DataTable with data.json */}
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-semibold">Document Review</CardTitle>
            <CardDescription>Track document review progress across your team</CardDescription>
          </div>
          <Button size="sm" variant="ghost" className="gap-1 text-xs" asChild>
            <a href="/docs" className="flex items-center gap-1">
              View all
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable data={data} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <CardDescription>Start a new workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button variant="outline" className="w-full justify-start gap-3 text-sm hover:bg-muted/50 transition-colors">
            <Mail className="h-4 w-4 shrink-0 text-blue-400" />
            New Campaign
            <ArrowUpRight className="h-3 w-3 ml-auto shrink-0 opacity-60" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-sm hover:bg-muted/50 transition-colors">
            <FileText className="h-4 w-4 shrink-0 text-emerald-400" />
            Write Document
            <ArrowUpRight className="h-3 w-3 ml-auto shrink-0 opacity-60" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-sm hover:bg-muted/50 transition-colors">
            <Activity className="h-4 w-4 shrink-0 text-purple-400" />
            View Analytics
            <ArrowUpRight className="h-3 w-3 ml-auto shrink-0 opacity-60" />
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 text-sm hover:bg-muted/50 transition-colors">
            <Users className="h-4 w-4 shrink-0 text-amber-400" />
            Add Lead
            <ArrowUpRight className="h-3 w-3 ml-auto shrink-0 opacity-60" />
          </Button>
          <Separator className="my-2" />
          <Button className="w-full justify-center gap-2 text-sm bg-primary hover:bg-primary/90">
            <MessageSquare className="h-4 w-4" />
            Open Prompt Center
          </Button>
        </CardContent>
      </Card>

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

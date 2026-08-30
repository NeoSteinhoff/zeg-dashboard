import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, ArrowDownRight, Search, Ban, Send, BarChart3, CheckCircle2, Users, Activity, DollarSign, Target, TrendingUp, Mail, LayoutDashboard } from "lucide-react"

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"]

const stats = [
  { label: "Total Revenue", value: "$47,290", change: "+12.5%", positive: true, icon: DollarSign },
  { label: "Active Users", value: "1,847", change: "+8.2%", positive: true, icon: Users },
  { label: "Open Rate", value: "52.3%", change: "-2.1%", positive: false, icon: Mail },
  { label: "Response Time", value: "1.2s", change: "-0.3s", positive: true, icon: Activity },
]

const trafficData = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Social", value: 17 },
  { name: "Referral", value: 12 },
  { name: "Email", value: 8 },
]

export default function DashboardView() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // Stable data — defined once, not on every render.
  const [selectedRange, setSelectedRange] = useState<string>("7d");

  const chartData = [
    { name: "Mon", revenue: 4200, users: 380 },
    { name: "Tue", revenue: 5800, users: 420 },
    { name: "Wed", revenue: 4900, users: 510 },
    { name: "Thu", revenue: 7200, users: 460 },
    { name: "Fri", revenue: 6100, users: 390 },
    { name: "Sat", revenue: 3400, users: 280 },
    { name: "Sun", revenue: 2800, users: 210 },
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Welcome back. Here's what's happening across Zeg.
              </p>
            </div>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>

          <Alert>
            <Target className="h-4 w-4" />
            <AlertTitle>Goal tracker</AlertTitle>
            <AlertDescription>
              50K AED target · 12,430 AED raised · 1 paying client · 13/31 WhatsApp notes sent
              · {Math.round((12430 / 50000) * 100)}% to goal
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.positive ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.positive ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">vs last month</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                    <div className="h-full bg-primary" style={{ width: "72%" }} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          <Card className="lg:col-span-2 h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Revenue</CardTitle>
                  <CardDescription>Last 7 days · AED</CardDescription>
                </div>
                <Select
                  value={selectedRange}
                  onValueChange={(v) => setSelectedRange(v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">This year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 -mx-2 -mb-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar name="Revenue" dataKey="revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where users come from</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={trafficData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="var(--chart-5)" label>
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <div className="border-t p-2 space-y-1">
              {trafficData.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {t.name}
                  </div>
                  <span className="font-medium">{t.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest events across the platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="#" className="flex items-center gap-1">View all <BarChart3 className="h-3 w-3" /></a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Time</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { type: "Email", desc: "Loom demo unblocked via WhatsApp simulator", status: "Sent", time: "2m ago" },
                    { type: "Lead", desc: "New lead pack #42 sold — 950 AED", status: "Completed", time: "15m ago" },
                    { type: "Deploy", desc: "Zeg Dashboard v2 pushed to production", status: "Live", time: "1h ago" },
                    { type: "WhatsApp", desc: "Voice note #13 sent to agent pipeline", status: "Sent", time: "3h ago" },
                    { type: "Email", desc: "Blast #412 — 46,656 emails delivered", status: "Delivered", time: "5h ago" },
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell><Badge variant={row.status === "Live" || row.status === "Delivered" ? "default" : "secondary"} className="text-xs">{row.type}</Badge></TableCell>
                      <TableCell className="font-medium">{row.desc}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{row.status}</Badge></TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-2">
              <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="default" className="w-full justify-start" onClick={() => navigate("/email")}><Mail className="h-4 w-4 mr-2" />Compose Email</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/docs")}><BarChart3 className="h-4 w-4 mr-2" />New Document</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/calendar")}><Activity className="h-4 w-4 mr-2" />Schedule Event</Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col gap-2">
              <CardHeader>
                <CardTitle className="text-sm">Quick Prompt</CardTitle>
                <CardDescription>Send a message directly</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Textarea placeholder="Type your prompt here..." className="min-h-[80px] text-sm" rows={3} />
                <div className="flex gap-2">
                  <Input placeholder="Recipient (e.g. vivaan@steinhoff.group)" className="flex-1 text-sm" />
                  <Button size="icon" variant="default"><Send className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

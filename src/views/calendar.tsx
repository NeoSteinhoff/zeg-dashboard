import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/sonner"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Bell,
  Settings,
  User,
  Key,
  Palette,
  Database,
  Folder,
  Command,
  Mail,
  MessageSquare,
  ExternalLink,
  Trash2,
  Edit,
  Copy,
  MoreHorizontal,
  Send,
  Loader2,
  CalendarPlus,
  Star,
} from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  end: Date
  allDay: boolean
  description: string
  color: string
  location: string
  attendees: string[]
  reminders: number[] // minutes before
}

const eventColors = {
  work: "#06b6d4",
  personal: "#f59e0b",
  meeting: "#8b5cf6",
  deadline: "#ef4444",
  social: "#10b981",
}

const initialEvents: CalendarEvent[] = [
  { id: "e1", title: "Zegoro — UI Review", date: new Date(2026, 8, 31, 10, 0), end: new Date(2026, 8, 31, 11, 0), allDay: false, description: "Review dashboard UI with team. Check all 8 subsystems.", color: eventColors.work, location: "Zegoro", attendees: ["Team Zegoro", "Vivaan"], reminders: [15, 60] },
  { id: "e2", title: "WhatsApp Voice Note Batch #14", date: new Date(2026, 8, 31, 14, 0), end: new Date(2026, 8, 31, 15, 30), allDay: false, description: "Send batch #14 of 31 WhatsApp voice notes to Dubai agent pipeline.", color: eventColors.work, location: "WhatsApp", attendees: ["Vivaan"], reminders: [30] },
  { id: "e3", title: "Lead Pack Demo — Client Meeting", date: new Date(2026, 9, 1, 9, 0), end: new Date(2026, 9, 1, 10, 0), allDay: false, description: "Demo the lead pack storefront to Sarah Chen. Discuss 15% comm share.", color: eventColors.meeting, location: "Zoom", attendees: ["Sarah Chen", "Team Zeg"], reminders: [60, 120] },
  { id: "e4", title: "Blast #413 — Email Campaign", date: new Date(2026, 9, 2, 8, 0), end: new Date(2026, 9, 2, 8, 0), allDay: true, description: "Send blast #413 — 46,656 emails via Resend. Projected delivery: 98.2%.", color: eventColors.deadline, location: "Resend", attendees: ["Resend Bot"], reminders: [120] },
  { id: "e5", title: "Dating Pipeline Cap Check", date: new Date(2026, 9, 3, 16, 0), end: new Date(2026, 9, 3, 16, 30), allDay: false, description: "Review pipeline.db: 13 girls, 2 Claimed + 4 active + 7 bench. Ensure CAP=7.", color: eventColors.personal, location: "Dating Pipeline", attendees: ["Hamza Ali"], reminders: [30] },
  { id: "e6", title: "Soul Extraction — fabrizio-rausa", date: new Date(2026, 9, 4, 11, 0), end: new Date(2026, 9, 4, 13, 0), allDay: false, description: "Build fabrizio-rausa soul from transcript. Need transcript text first.", color: eventColors.social, location: "Soul Extractor v4", attendees: ["Solar Pro4"], reminders: [60] },
  { id: "e7", title: "Steinhoff Group — Monthly Review", date: new Date(2026, 9, 5, 0, 0), end: new Date(2026, 9, 5, 0, 0), allDay: true, description: "Monthly review of all Steinhoff Systems projects. 50K AED goal check.", color: eventColors.work, location: "Conference Room", attendees: ["Full Team"], reminders: [1440] },
  { id: "e8", title: "Auth Flow — Passwordless Implementation", date: new Date(2026, 9, 5, 15, 0), end: new Date(2026, 9, 5, 16, 0), allDay: false, description: "Review and finalize passwordless auth flow. Any email accepted, no password required.", color: eventColors.work, location: "Zegoro", attendees: ["Engineering"], reminders: [30] },
]

export default function CalendarView() {
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 30))
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showNewEvent, setShowNewEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: viewDate,
    end: new Date(),
    allDay: false,
    description: "",
    color: eventColors.work,
    location: "",
    attendees: "",
    reminders: "30",
  })
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")

  const eventsForDate = (date: Date) =>
    events.filter((e) => {
      const d = e.date
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
    })

  function getEventsForDay(date: Date) {
    return events.filter((e) => {
      const d = e.date
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
    }).sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  function handleCreate() {
    if (!newEvent.title.trim()) return
    const ev: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      end: newEvent.end || newEvent.date,
      allDay: newEvent.allDay,
      description: newEvent.description || "No description",
      color: newEvent.color,
      location: newEvent.location || "—",
      attendees: newEvent.attendees.split(",").map((a) => a.trim()).filter(Boolean),
      reminders: [parseInt(newEvent.reminders) || 30],
    }
    setEvents((prev) => [...prev, ev])
    setNewEvent({ title: "", date: viewDate, end: new Date(), allDay: false, description: "", color: eventColors.work, location: "", attendees: "", reminders: "30" })
    setShowNewEvent(false)
    setToast(`Event "${ev.title}" created`)
    setTimeout(() => setToast(""), 3000)
  }

  function handleDelete(ev: CalendarEvent) {
    setEvents((prev) => prev.filter((e) => e.id !== ev.id))
    setSelectedEvent(null)
    setToast(`Event deleted`)
    setTimeout(() => setToast(""), 2000)
  }

  const dayEvents = getEventsForDay(viewDate)

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant={viewMode === "month" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("month")}>Month</Button>
            <Button variant={viewMode === "week" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("week")}>Week</Button>
            <Button variant={viewMode === "day" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("day")}>Day</Button>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => setViewDate(new Date(2026, 8, 30))}>
              <CalendarIcon className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
              <ChevronRight className="h-3.5 w-3.5 -rotate-180" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button variant="default" size="sm" className="gap-1.5 ml-auto" onClick={() => setShowNewEvent(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Event
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 gap-4">
          {/* Date sidebar */}
          <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{viewDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
              </div>
              <div className="space-y-1">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-2 p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="mt-0.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{ev.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {ev.allDay ? "All day" : ev.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <CalendarPlus className="h-6 w-6 mx-auto mb-1 opacity-40" />
                    No events for this day
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Upcoming</p>
              <div className="space-y-2">
                {events.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="flex items-start gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                    <div className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{ev.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {ev.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {!ev.allDay && ` · ${ev.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                    {ev.id === selectedEvent?.id && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
            {viewMode === "month" ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                  ))}
                  {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1)
                    const dayEvents = getEventsForDay(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isSelected = date.toDateString() === viewDate.toDateString()
                    return (
                      <div
                        key={i}
                        className={`aspect-square p-1 rounded-lg cursor-pointer flex flex-col gap-0.5 transition-colors border ${
                          isSelected ? "bg-accent/50 border-primary" : isToday ? "bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setViewDate(date)}
                      >
                        <span className={`text-xs ${isToday ? "font-bold text-primary" : ""}`}>{date.getDate()}</span>
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div key={ev.id} className="h-1 rounded-full" style={{ backgroundColor: ev.color + "cc", opacity: 0.8 }} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] text-muted-foreground">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4 border rounded-lg">
                {/* Week/Day header */}
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate() - viewDate.getDay() + i)
                    const dayEvents = getEventsForDay(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    return (
                      <div key={i} className="flex-1 text-center">
                        <div className={`text-xs font-semibold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className={`text-lg ${isToday ? "text-primary" : "text-foreground"}`}>
                          {date.getDate()}
                        </div>
                        <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                          {dayEvents.slice(0, 4).map((ev) => (
                            <div key={ev.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ev.color }} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Event rows */}
                <div className="space-y-1">
                  {getEventsForDay(viewDate).map((ev) => (
                    <div key={ev.id} className="flex items-start gap-2 p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted/80" onClick={() => setSelectedEvent(ev)}>
                      <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {ev.allDay ? "All day" : `${ev.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} — ${ev.end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ev.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {ev.attendees.slice(0, 2).map((a) => (
                            <span key={a} className="text-[10px] bg-primary/10 text-primary px-1 rounded">@{a}</span>
                          ))}
                          {ev.attendees.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{ev.attendees.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {getEventsForDay(viewDate).length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      No events — click "New Event" to add one
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event detail modal */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedEvent?.color }} />
                {selectedEvent?.title}
                <Button variant="ghost" size="icon-sm" className="ml-auto h-6 w-6" onClick={() => setSelectedEvent(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedEvent.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedEvent.allDay ? "All day" : `${selectedEvent.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} — ${selectedEvent.end.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Description</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Location</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedEvent.location}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Attendees ({selectedEvent.attendees.length})</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.attendees.map((a) => (
                      <Badge key={a} variant="secondary" className="text-[10px]">@{a}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Reminders</Label>
                  <div className="flex gap-1">
                    {selectedEvent.reminders.map((r) => (
                      <Badge key={r} variant="outline" className="text-[10px]">{r} min before</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedEvent(null)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={() => handleDelete(selectedEvent!)}>
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 ml-auto" onClick={() => setSelectedEvent(null)}>
                    <Copy className="h-3 w-3" />
                    Duplicate
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New event dialog */}
        <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Event Title</Label>
                <Input value={newEvent.title} onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))} placeholder="Event title" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start mt-1">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                        {newEvent.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={newEvent.date} onSelect={(d) => d && setNewEvent((p) => ({ ...p, date: d }))} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-1 mt-1">
                    {Object.entries(eventColors).map(([key, color]) => (
                      <button
                        key={key}
                        className={`w-6 h-6 rounded-full cursor-pointer ring-2 ${newEvent.color === color ? "ring-foreground" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewEvent((p) => ({ ...p, color }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">All day</Label>
                <Switch checked={newEvent.allDay} onCheckedChange={(c) => setNewEvent((p) => ({ ...p, allDay: c }))} />
              </div>
              {!newEvent.allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <Input type="time" value={newEvent.date.toTimeString().slice(0, 5)} onChange={(e) => setNewEvent((p) => ({ ...p, date: new Date(p.date.setHours(parseInt(e.target.value.split(":")[0]), parseInt(e.target.value.split(":")[1]), 0, 0)) }))} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <Input type="time" value={newEvent.end.toTimeString().slice(0, 5)} onChange={(e) => setNewEvent((p) => ({ ...p, end: new Date(p.end.setHours(parseInt(e.target.value.split(":")[0]), parseInt(e.target.value.split(":")[1]), 0, 0)) }))} className="mt-1" />
                  </div>
                </div>
              )}
              <div>
                <Label className="text-xs">Location</Label>
                <Input value={newEvent.location} onChange={(e) => setNewEvent((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Attendees (comma-separated)</Label>
                <Input value={newEvent.attendees} onChange={(e) => setNewEvent((p) => ({ ...p, attendees: e.target.value }))} placeholder="Attendee 1, Attendee 2" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea value={newEvent.description} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))} placeholder="Event description..." className="mt-1 min-h-[80px]" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setShowNewEvent(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} disabled={!newEvent.title.trim()} className="ml-auto">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toast && (
          <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <Check className="h-4 w-4" />
            {toast}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

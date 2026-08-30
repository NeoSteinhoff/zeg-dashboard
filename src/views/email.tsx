import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Mail,
  Send,
  ChevronRight,
  Star,
  Archive,
  Trash2,
  Inbox,
  Drafts,
  Sent,
  Schedule,
  Sparkles,
  Copy,
  CheckCircle2,
  Clock,
  Grid,
  List,
  Search,
  Filter,
  RefreshCw,
  SwitchHiSort,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Reply,
  Forward,
  Bookmark,
  ExternalLink,
  Paperclip,
  Smile,
  X,
  LogIn,
  Loader2,
} from "lucide-react"

// --- Data ---
const folders = [
  { id: "inbox", label: "Inbox", count: 147, icon: Inbox },
  { id: "drafts", label: "Drafts", count: 3, icon: Drafts },
  { id: "sent", label: "Sent", count: 892, icon: Sent },
  { id: "scheduled", label: "Scheduled", count: 12, icon: Schedule },
  { id: "archived", label: "Archived", count: 234, icon: Archive },
]

const labels = [
  { id: "important", color: "text-red-500 bg-red-500/10", name: "Important" },
  { id: "clients", color: "text-blue-500 bg-blue-500/10", name: "Clients" },
  { id: "steinhoff", color: "text-purple-500 bg-purple-500/10", name: "Steinhoff" },
  { id: "resend", color: "text-cyan-500 bg-cyan-500/10", name: "Resend" },
  { id: "promotions", color: "text-amber-500 bg-amber-500/10", name: "Promotions" },
]

const emails = [
  { id: 1, from: "Vivaan", email: "vivaan@steinhoff.group", subject: "WhatsApp voice note #13 — Loom demo finally unblocked", preview: "Hey, after some debugging with the simulator, the Loom demo is now actually working. I recorded a 60-second walkthrough. Can you check it out?", time: "2:14 PM", unread: true, starred: false, label: "important", avatar: "V" },
  { id: 2, from: "Sarah Chen", email: "sarah.chen@aol.com", subject: "Re: Lead pack pricing — can we do 15% comm instead of 12%?", preview: "Love the 950/3,200 structure but our agents are pushing back on the 12% share. Would 15% work for us? We'd commit to 50 packs/mo.", time: "11:32 AM", unread: true, starred: true, label: "clients", avatar: "S" },
  { id: 3, from: "Resend Bot", email: "no-reply@resend.dev", subject: "Delivery report: Blast #412 — 46,656 emails sent", preview: "Blast #412 completed successfully. 46,656 emails sent, 45,818 delivered (98.2%), 838 bounced (1.8%), 0 spam complaints.", time: "9:08 AM", unread: false, starred: false, label: "resend", avatar: "R" },
  { id: 4, from: "Team Zeg", email: "team@zeg.steinhoff.group", subject: "Dashboard v2 deployment live on zeg.steinhoff.group", preview: "The new Zeg Dashboard is live. All subsystems are accessible: Dashboard, Email, Docs, Files, Obsidian, Calendar, Settings, Auth. Check it out and let us know what you think.", time: "Yesterday", unread: false, starred: true, label: "steinhoff", avatar: "Z" },
  { id: 5, from: "Alex Hormozi", email: "alex@hormozi.com", subject: "Quick thoughts on the storefront concept", preview: "I looked at the agent storefront you're building. A few ideas: 1) Add a live agent leaderboard. 2) Let agents book demo slots directly. 3) Video testimonials from top performers.", time: "Yesterday", unread: false, starred: false, label: null, avatar: "A" },
  { id: 6, from: "Marcus Hullaster", email: "marcus@datingadvice.io", subject: "Re: Dating pipeline integration with Hermes", preview: "You should wire the dating pipeline API (pipeline_api.py on :8882) directly into the prompt sender. That way every prompt can be persona-tagged and routed to the right soul.", time: "Aug 28", unread: false, starred: false, label: "important", avatar: "M" },
  { id: 7, from: "Hamza Ali", email: "hamza@soulpreneur.co", subject: "The 418 soul consultation rules — quick summary", preview: "I've been going through the SOUL-CONSULTATION-PART3.md file. Here's my 1-page summary of the 418 rules broken into 14 soul council members...", time: "Aug 27", unread: false, starred: false, label: null, avatar: "H" },
  { id: 8, from: "David Goggins", email: "david@davidgoggins.com", subject: "You're not suffering enough", preview: "If you think building a dashboard is hard, try running 200 miles. Keep pushing. The dashboard is just another callous you need to build.", time: "Aug 26", unread: false, starred: false, label: null, avatar: "D" },
]

const composeState = {
  to: "",
  subject: "",
  body: "",
  selectedFolder: "inbox",
  viewMode: "list" as "list" | "grid",
  searchQuery: "",
  selectedEmailId: null as number | null,
  selectedLabel: null as string | null,
  composing: false,
  sentConfirmation: false,
}

// Forwarding and reply drafts
const [replyTo, setReplyTo] = useState("")
const [replyText, setReplyText] = useState("")
const [forwardSubject, setForwardSubject] = useState("")
const [forwardText, setForwardText] = useState("")

export default function EmailView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState(composeState);
  const [showCompose, setShowCompose] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replyText, setReplyText] = useState("");
  const [forwardSubject, setForwardSubject] = useState("");
  const [forwardText, setForwardText] = useState("");

  const foldersMap = Object.fromEntries(folders.map((f) => [f.id, f]));

  const filteredEmails = emails.filter((e) => {
    const folder = state.selectedFolder;
    if (folder === "inbox") return e.unread;
    if (folder === "drafts") return e.subject.toLowerCase().includes("draft");
    if (folder === "sent") return !e.unread;
    if (folder === "archived" || folder === "scheduled") return false;
    return true;
  }).filter((e) => {
    if (!state.searchQuery) return true;
    const q = state.searchQuery.toLowerCase();
    return (
      e.from.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.preview.toLowerCase().includes(q)
    );
  });

  const selectedEmail = emails.find((e) => e.id === state.selectedEmailId);

  function markRead(id: number) {
    setState((s) => ({
      ...s,
      selectedEmailId: id,
      // Also mark this email as read in the local data model.
      // EmailView is a demo; in production this would go through the API.
    }));
  }

  function handleSend() {
    if (!state.to || !state.body) return
    setState((s) => ({ ...s, composing: false, to: "", subject: "", body: "", sentConfirmation: true }))
    setToastMsg(`Message sent to ${state.to}`)
    setTimeout(() => setToastMsg(""), 3000)
    setTimeout(() => setState((s) => ({ ...s, sentConfirmation: false })), 5000)
  }

  function handleReply() {
    if (!replyText) return
    setToastMsg("Reply sent")
    setTimeout(() => setToastMsg(""), 2000)
    setShowReply(false)
    setReplyText("")
    setReplyTo("")
  }

  function handleForward() {
    if (!forwardText) return
    setToastMsg("Forwarded")
    setTimeout(() => setToastMsg(""), 2000)
    setShowForward(false)
    setForwardText("")
    setForwardSubject("")
  }

  return (
    <TooltipProvider>
      <div className="flex h-full gap-0">
        {/* Sidebar folder tree */}
        <div className="w-52 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>Z</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">zeg.steinhoff.group</p>
                <p className="text-xs text-muted-foreground truncate">resend@zeg</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Folders */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-0.5">
              {folders.map((f) => {
                const isActive = state.selectedFolder === f.id
                const Icon = f.icon
                return (
                  <Button
                    key={f.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-2 h-8 text-sm ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`}
                    onClick={() => setState((s) => ({ ...s, selectedFolder: f.id, selectedEmailId: null, searchQuery: "" }))}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{f.label}</span>
                    <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto h-5 min-w-5 px-1.5 text-[10px]">
                      {f.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>

            <Separator />

            {/* Labels */}
            <div className="p-2">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold px-2 mb-1">Labels</p>
              <div className="space-y-0.5">
                {labels.map((l) => (
                  <button
                    key={l.id}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                      state.selectedLabel === l.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setState((s) => ({ ...s, selectedLabel: l.id === state.selectedLabel ? null : l.id }))}
                  >
                    <span className={`h-2 w-2 rounded-full ${l.color}`} />
                    <span>{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Compose */}
            <div className="p-2">
              <Button
                variant="default"
                className="w-full justify-center gap-1.5"
                onClick={() => setShowCompose(true)}
              >
                <Send className="h-3.5 w-3.5" />
                Compose
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Email list + detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-2 p-3 border-b bg-card">
            <Select value={state.selectedFolder} onValueChange={(v: string) => setState((s) => ({ ...s, selectedFolder: v, selectedEmailId: null }))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 flex items-center gap-2 ml-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  value={state.searchQuery}
                  onChange={(e) => setState((s) => ({ ...s, searchQuery: e.target.value }))}
                  className="pl-8 h-7 text-xs bg-muted/50"
                />
              </div>
              <Button variant="outline" size="icon-sm" onClick={() => setState((s) => ({ ...s, viewMode: state.viewMode === "list" ? "grid" : "list" }))}>
                {state.viewMode === "list" ? <Grid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Email list */}
            <div className={`${state.viewMode === "grid" ? "hidden lg:block" : ""} w-full lg:w-[400px] xl:w-[480px] border-r border-border flex flex-col min-h-0`}>
              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {filteredEmails.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No emails here
                    </div>
                  ) : (
                    filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className={`p-3 cursor-pointer transition-colors ${
                          state.selectedEmailId === email.id
                            ? "bg-accent/50 border-l-2 border-l-primary"
                            : "hover:bg-muted/50"
                        } ${email.unread ? "bg-muted/30" : ""}`}
                        onClick={() => markRead(email.id)}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs">{email.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {email.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                                <span className={`text-sm truncate ${email.unread ? "font-semibold" : "font-normal"}`}>
                                  {email.from}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {email.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{email.time}</span>
                              </div>
                            </div>
                            <p className={`text-sm truncate ${email.unread ? "font-semibold" : "font-normal text-muted-foreground"}`}>
                              {email.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {email.preview}
                            </p>
                            {email.label && (
                              <Badge
                                variant="secondary"
                                className={`mt-1.5 ${email.label === "important" ? "text-red-500 bg-red-500/10" : ""}`}
                                className="text-[10px]"
                              >
                                {labels.find((l) => l.id === email.label)?.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Email detail */}
            <div className={`${state.viewMode === "grid" ? "block" : "hidden lg:block"} lg:flex-1 flex flex-col min-h-0 bg-muted/30`}>
              {selectedEmail ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Avatar className="h-5 w-5"><AvatarFallback className="text-[10px]">{selectedEmail.avatar}</AvatarFallback></Avatar>
                          <span className="font-medium">{selectedEmail.from}</span>
                          <span className="text-muted-foreground">&lt;{selectedEmail.email}&gt;</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={() => setState((s) => ({ ...s, selectedEmailId: null }))}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Close</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.preview}</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mt-4 text-muted-foreground">
                      —{selectedEmail.from}<br />
                      {selectedEmail.time}
                    </p>
                  </ScrollArea>

                  <div className="p-3 border-t bg-card flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => { setReplyTo(selectedEmail.email); setShowReply(true) }}>
                          <Reply className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => setShowForward(true)}>
                          <Forward className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Forward</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => setState((s) => ({ ...s, selectedEmailId: null }))}>
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Archive</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-4 mx-1" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => setState((s) => ({ ...s, selectedEmailId: null }))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => setState((s) => ({ ...s, selectedEmailId: null }))}>
                          <Bookmark className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bookmark</TooltipContent>
                    </Tooltip>
                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <Paperclip className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Smile className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Mark as read</DropdownMenuItem>
                          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                          <DropdownMenuItem>Mute</DropdownMenuItem>
                          <DropdownMenuItem>Snooze</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Mail className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select an email to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs">To</Label>
                <Input
                  value={state.to}
                  onChange={(e) => setState((s) => ({ ...s, to: e.target.value }))}
                  placeholder="recipient@email.com"
                  className="mt-0.5"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Subject</Label>
                <Input
                  value={state.subject}
                  onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                  placeholder="Subject line"
                  className="mt-0.5"
                />
              </div>
            </div>
            <Textarea
              value={state.body}
              onChange={(e) => setState((s) => ({ ...s, body: e.target.value }))}
              placeholder="Write your message..."
              className="min-h-[150px]"
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCompose(false)}>
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!state.to || !state.body}
              className="ml-auto"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={showReply} onOpenChange={setShowReply}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {replyTo}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`On ${new Date().toLocaleDateString()}, ${replyTo} wrote:`}
            className="min-h-[150px]"
            rows={6}
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowReply(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleReply} disabled={!replyText} className="ml-auto">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forward Dialog */}
      <Dialog open={showForward} onOpenChange={setShowForward}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={forwardSubject}
              onChange={(e) => setForwardSubject(e.target.value)}
              placeholder="Fwd: Original subject"
              className="mt-0.5"
            />
            <Textarea
              value={forwardText}
              onChange={(e) => setForwardText(e.target.value)}
              placeholder="Forwarded message content..."
              className="min-h-[100px]"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowForward(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleForward} disabled={!forwardText} className="ml-auto">
              <Forward className="h-3.5 w-3.5 mr-1.5" />
              Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {toastMsg}
        </div>
      )}
    </TooltipProvider>
  )
}

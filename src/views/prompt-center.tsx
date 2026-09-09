import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Send,
  History,
  Settings,
  Zap,
  MessageSquare,
  Brain,
  Shield,
  BookOpen,
  ChevronRight,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Lightbulb,
  RotateCcw,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Star,
  Search,
  Command,
  Layers,
  DollarSign,
  Heart,
} from "lucide-react"

// ── Persona / soul catalog ────────────────────────────────────────────────────
const PERSONAS = [
  { id: "general", name: "General", icon: MessageSquare, desc: "Open-ended assistant", color: "bg-slate-500" },
  { id: "stei-lead", name: "Steinhoff Lead", icon: Zap, desc: "Dubai real estate lead gen", color: "bg-emerald-500" },
  { id: "soul-hamza", name: "Hamza Ali", icon: Brain, desc: "Soul / dating coach persona", color: "bg-rose-500" },
  { id: "soul-fabrizio", name: "Fabrizio Rausa", icon: Shield, desc: "Dating strategy expert", color: "bg-violet-500" },
  { id: "soul-goggins", name: "David Goggins", icon: TrendingUp, desc: "Mental toughness / grind", color: "bg-orange-500" },
  { id: "soul-hormozi", name: "Alex Hormozi", icon: DollarSign, desc: "Business / value creation", color: "bg-blue-500" },
  { id: "soul-hussey", name: "Matthew Hussey", icon: Heart, desc: "Dating / relationship advice", color: "bg-pink-500" },
  { id: "soul-corey", name: "Corey Wayne", icon: MessageCircle, desc: "Dating / masculinity coach", color: "bg-cyan-500" },
  { id: "soul-warken", name: "Gavin Warken", icon: BookOpen, desc: "Dark romance / writing", color: "bg-indigo-500" },
  { id: "resend", name: "Resend Bot", icon: Send, desc: "Email / blast operations", color: "bg-teal-500" },
  { id: "coding", name: "Code Assistant", icon: Settings, desc: "React / Vite / shadcn help", color: "bg-yellow-500" },
]

const SUGGESTED_PROMPTS = [
  { text: "Write a WhatsApp voice note script for Dubai agent lead outreach", persona: "stei-lead" },
  { text: "Give me 5 dating openers that feel natural and non-neediy", persona: "soul-hamza" },
  { text: "Draft a cold email for the 950/3,200 lead pack offer", persona: "resend" },
  { text: "Explain the 418 soul consultation rules in simple terms", persona: "soul-hamza" },
  { text: "How do I structure a Vite + React + shadcn dashboard layout?", persona: "coding" },
  { text: "Write a value-creation memo in Hormozi style", persona: "soul-hormozi" },
]

const CHAT_HISTORY: { id: string; prompt: string; persona: string; response: string; timestamp: string; status: "sent" | "pending" | "error" }[] = [
  { id: "1", prompt: "How do I write better cold emails?", persona: "resend", response: "Great question. The best cold emails are short, specific, and lead with value. Start with a one-line hook that shows you've done your research, then state the offer clearly, then end with a single low-friction CTA. Avoid 'I hope this finds you well' — it signals desperation. Lead with the outcome they get, not what you do.", timestamp: "2 min ago", status: "sent" },
  { id: "2", prompt: "Write me a WhatsApp voice note script for Dubai agents", persona: "stei-lead", response: "Here's a script you can send: 'Hey, I'm working with Steinhoff Group in Dubai — we're helping real estate agents automate their WhatsApp lead outreach. I've got a 60-second voice note demo that shows exactly how it works. Want me to send it over?' Short, direct, low pressure. Record it in your own voice.", timestamp: "15 min ago", status: "sent" },
  { id: "3", prompt: "What's the best dating opener for a first message?", persona: "soul-hussey", response: "The best opener is one that shows you've actually read her profile. Reference something specific — a photo, a detail, a hobby. 'I see you're into hiking — what's your favorite trail?' beats 'Hey, how are you?' every time. The goal is to start a conversation, not to impress.", timestamp: "1 hour ago", status: "sent" },
  { id: "4", prompt: "How do I structure a Vite + React dashboard layout?", persona: "coding", response: "Use a sidebar layout with react-router-dom's Outlet for nested routes. The sidebar handles navigation, the main area renders the matched child route. Shadcn's sidebar component gives you the desktop + mobile sheet pattern out of the box. Keep the sidebar state in a layout component, not in each view.", timestamp: "3 hours ago", status: "sent" },
]

// ── Prompt composer state ─────────────────────────────────────────────────────
type PersonaId = string

interface PromptMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function PromptCenter() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("compose")
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("general")
  const [promptText, setPromptText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [chatMessages, setChatMessages] = useState<PromptMessage[]>([])
  const [chatHistory, setChatHistory] = useState(CHAT_HISTORY)
  const [searchQuery, setSearchQuery] = useState("")
  const [showHistoryDetail, setShowHistoryDetail] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [maxChars] = useState(4000)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) ?? PERSONAS[0]

  useEffect(() => {
    setCharCount(promptText.length)
  }, [promptText])

  const handleSend = async () => {
    if (!promptText.trim() || isSending) return
    setIsSending(true)
    const userMsg: PromptMessage = {
      id: Date.now().toString(),
      role: "user",
      content: promptText.trim(),
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMsg])
    const sentText = promptText.trim()
    setPromptText("")

    // Simulate sending — in production this would hit the Hermes API
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))

    const assistantMsg: PromptMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `[${currentPersona.name}] Here's a response to your prompt: "${sentText.slice(0, 60)}${sentText.length > 60 ? "…" : ""}"\n\nThis is a simulated response. Connect the Hermes API to get real AI output. The prompt was sent with persona: ${currentPersona.name}.`,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, assistantMsg])
    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredHistory = chatHistory.filter(
    (h) =>
      h.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.persona.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Prompt Center</h1>
              <p className="text-muted-foreground text-sm">Send prompts through any persona — powered by Hermes</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span>11 personas available · 4000 char limit · Ctrl+Enter to send</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              History
              {chatHistory.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
                  {chatHistory.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="personas" className="gap-1.5">
              <Brain className="h-3.5 w-3.5" />
              Personas
            </TabsTrigger>
          </TabsList>

          {/* ── Compose tab ─────────────────────────────────────────────── */}
          <TabsContent value="compose" className="space-y-4">
            {/* Persona selector */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Active Persona</CardTitle>
                <CardDescription>Choose the persona that shapes your prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {PERSONAS.map((p) => {
                    const Icon = p.icon
                    const isActive = selectedPersona === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersona(p.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${p.color} text-white`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        {p.name}
                        {isActive && <ChevronRight className="h-3 w-3 ml-0.5" />}
                      </button>
                    )
                  })}
                </div>
                {currentPersona && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    <span>{currentPersona.desc}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prompt composer */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-base font-semibold">Compose Prompt</CardTitle>
                    <CardDescription>Write your prompt — it will be routed through the selected persona</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={charCount > maxChars ? "text-red-400" : ""}>{charCount}/{maxChars}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <kbd className="flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-mono">
                      <Command className="h-3 w-3" />
                      <kbd className="h-3 w-3 rounded bg-background text-muted-foreground">Enter</kbd>
                    </kbd>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Suggested prompts */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lightbulb className="h-3 w-3" />
                      <span>Suggested prompts</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_PROMPTS.filter(
                        (sp) => sp.persona === selectedPersona || selectedPersona === "general"
                      ).slice(0, 3).map((sp, i) => (
                        <button
                          key={i}
                          onClick={() => setPromptText(sp.text)}
                          className="text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded px-2.5 py-1 transition-colors max-w-xs truncate"
                        >
                          {sp.text}
                        </button>
                      ))}
                      {SUGGESTED_PROMPTS.filter((sp) => sp.persona === selectedPersona).length === 0 && (
                        <span className="text-xs text-muted-foreground self-center">Select a persona to see suggestions</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message ${currentPersona.name}…`}
                      className="min-h-[160px] resize-none text-sm"
                      rows={5}
                    />
                    {charCount > maxChars * 0.9 && (
                      <div className={`absolute bottom-2 right-2 text-[10px] font-medium ${charCount > maxChars ? "text-red-400" : "text-amber-400"}`}>
                        {charCount > maxChars ? "Limit reached" : `${maxChars - charCount} chars left`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Send className="h-3.5 w-3.5" />
                      <span>Will be sent as <span className="font-medium text-foreground">{currentPersona.name}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPromptText("")}
                        className="gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSend}
                        disabled={!promptText.trim() || isSending}
                        className="gap-1.5 bg-primary hover:bg-primary/90"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Send Prompt
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live preview panel */}
            {chatMessages.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-base font-semibold">Live Session</CardTitle>
                      <CardDescription>Current conversation</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => setChatMessages([])}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScrollArea className="h-[200px] rounded-lg border border-border bg-card/50 p-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tl-none"
                              : "bg-muted text-foreground rounded-tr-none"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <span className="font-medium">You</span>
                          ) : (
                            <span className="font-medium text-primary">{currentPersona.name}</span>
                          )}
                          <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px]">
                            {msg.content}
                          </pre>
                          <div className="mt-1 flex items-center gap-2 text-[10px] opacity-60">
                            <Clock className="h-3 w-3" />
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg rounded-tr-none px-3 py-2">
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          <span className="text-xs text-muted-foreground ml-2">Waiting for response…</span>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {chatMessages.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">No prompts sent yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Compose a prompt above, select a persona, and hit send.
                    Your conversation will appear here in real time.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Ctrl+Enter to send · Esc to clear</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── History tab ─────────────────────────────────────────────── */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-base font-semibold">Prompt History</CardTitle>
                    <CardDescription>Previous prompts and responses</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search history…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-7 text-xs w-56"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <History className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No prompts found</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {filteredHistory.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-border bg-card/50 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setShowHistoryDetail(showHistoryDetail === item.id ? null : item.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                  {item.persona}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                                {item.status === "sent" && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                                )}
                                {item.status === "error" && (
                                  <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                                )}
                              </div>
                              <p className="text-sm font-medium truncate">{item.prompt}</p>
                              {showHistoryDetail === item.id && (
                                <div className="mt-2 rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground whitespace-pre-wrap">
                                  {item.response}
                                </div>
                              )}
                            </div>
                            <ChevronRight
                              className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${showHistoryDetail === item.id ? "rotate-90" : ""}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Personas tab ────────────────────────────────────────────── */}
          <TabsContent value="personas" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base font-semibold">Available Personas</CardTitle>
                  <CardDescription>Each persona shapes how prompts are framed and answered</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {PERSONAS.map((p) => {
                      const Icon = p.icon
                      const isActive = selectedPersona === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPersona(p.id)
                            setActiveTab("compose")
                          }}
                          className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                            isActive
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:bg-muted/50"
                          }`}
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${p.color} text-white`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                                {p.name}
                              </p>
                              {isActive && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* How it works card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  How Prompt Routing Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">1</div>
                  <div>
                    <p className="font-medium">You write a prompt</p>
                    <p className="text-muted-foreground text-xs">Type your message in the composer above.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">2</div>
                  <div>
                    <p className="font-medium">You select a persona</p>
                    <p className="text-muted-foreground text-xs">Choose from 11 personas — each has a unique voice and domain expertise.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">3</div>
                  <div>
                    <p className="font-medium">Hermes shapes the prompt</p>
                    <p className="text-muted-foreground text-xs">The persona's rules, tone, and context are injected into the prompt before it reaches the AI model.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">4</div>
                  <div>
                    <p className="font-medium">Response flows back</p>
                    <p className="text-muted-foreground text-xs">The AI's reply appears in your live session — in the persona's voice.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HelpCircle className="h-3 w-3" />
                  <span>Connect the Hermes API to enable real AI responses. Currently in demo mode.</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

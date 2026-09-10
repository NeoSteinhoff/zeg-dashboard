import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  FileText,
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Share2,
  Copy,
  Check,
  Clock,
  File,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Archive,
  Layers,
  ExternalLink,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

// Notion-style document data
interface Doc {
  id: string
  title: string
  content: string
  tags: string[]
  created: string
  updated: string
  author: string
  starred: boolean
  collaborators: string[]
}

const documents: Doc[] = [
  { id: "1", title: "Zegoro — Product Spec", content: "## Overview\nThe Zegoro is a unified command center for the Steinhoff Group's AI lead automation pipeline.\n\n## Goals\n- 50K AED in 2 months\n- 1 paying client by Sep 6\n- 13/31 WhatsApp voice notes sent\n\n## Architecture\n- Vite + React + shadcn/ui (base-nova)\n- 8 subsystem views via sidebar navigation\n- Resend for email delivery\n- Obsidian vault integration", tags: ["product", "spec"], created: "Aug 30, 2026", updated: "Aug 30, 2026", author: "Zeg Team", starred: true, collaborators: ["Vivaan", "Sarah"] },
  { id: "2", title: "Steinhoff Group — 645-Agent Pipeline", content: "## Pipeline Overview\n645 agents across Dubai real estate market.\n\n## WhatsApp Automation\n- Voice notes sent in batches of 31\n- 13/31 completed (41.9%)\n- Loom demo unblocked via simulator\n\n## Lead Resale Model\n- $950 / 3,200 lead packs\n- 12% commission share\n- Projected 46,656 AED / blast\n\n## Telegram Integration\n- Vivaan runs 'Mommy' agent → personal Gmail", tags: ["pipeline", "agents"], created: "Aug 28, 2026", updated: "Aug 29, 2026", author: "Vivaan", starred: false, collaborators: ["Team Zegoro"] },
  { id: "3", title: "Dating Pipeline — 14 Soul Council", content: "## Soul Consultation Rules\n418 rules across 14 council members.\n\n## Indexed Souls\n- hamza-ali, jake-abdo, marcus-hullaster\n- orion-taraban, robert-geronimo, mystery-method\n\n## Pipeline DB\n- 13 girls: 2 Claimed + 4 active + 7 bench\n- Cap: 6/6\n- API on :8882 (pipeline_api.py)\n\n## Soul Model\n- seed_soul_model.py + triage_soul_model.py\n- heat_v2 + stage_new routing", tags: ["dating", "souls"], created: "Aug 25, 2026", updated: "Aug 27, 2026", author: "Hamza Ali", starred: true, collaborators: [] },
  { id: "4", title: "Hermes Agent — Prompt Session Log", content: "## Session Summary (Aug 30, 2026)\n- Model: upstage/solar-pro4:free via Nous\n- Active: Zegoro build\n\n## Prompts Used\n1. Dashboard overhaul with sidebar\n2. Email client (sidebar-09 / Resend)\n3. Notion-style docs (sidebar-10)\n4. Files viewer (sidebar-11)\n5. Obsidian vault (sidebar-11 baseline)\n6. Calendar (sidebar-12)\n7. Settings (sidebar-13)\n8. Auth / login-01 (no password)\n\n## Architecture Decisions\n- base-nova style for all shadcn components\n- Vite + React + Tailwind CSS v4\n- react-router-dom for routing\n- recharts for dashboard charts\n- react-day-picker for calendar", tags: ["hermes", "session"], created: "Aug 30, 2026", updated: "Aug 30, 2026", author: "Solar Pro4", starred: false, collaborators: ["Nous Research"] },
  { id: "5", title: "Resend Integration — Blast Report #412", content: "## Blast #412 Results\n- 46,656 emails sent\n- 45,818 delivered (98.2%)\n- 838 bounced (1.8%)\n- 0 spam complaints\n\n## Setup\n- Gmail SMTP for personal/replies (smtp.gmail.com:587)\n- RESEND for sponsorship/bulk (NOT Brevo)\n- API key in config\n\n## Storefront\n- Lead packs: $950 / 3,200\n- Projecting 46,656 AED / blast\n- Agent storefront at leads/agent-storefront/", tags: ["resend", "email"], created: "Aug 27, 2026", updated: "Aug 29, 2026", author: "Resend Bot", starred: false, collaborators: ["Team Zegoro"] },
]

export default function DocsView() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTags, setNewTags] = useState("")
  const [toast, setToast] = useState("")
  const [copilotPanel, setCopilotPanel] = useState(false)

  const selectedDoc = documents.find((d) => d.id === selectedId)
  const filtered = documents.filter((d) =>
    !search ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
    d.content.toLowerCase().includes(search.toLowerCase())
  )

  function handleCreate() {
    if (!newTitle.trim()) return
    documents.unshift({
      id: Date.now().toString(),
      title: newTitle,
      content: newContent || "# New Document\n\nStart writing here...",
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      created: new Date().toLocaleDateString(),
      updated: new Date().toLocaleDateString(),
      author: "You",
      starred: false,
      collaborators: [],
    })
    setNewTitle("")
    setNewContent("")
    setNewTags("")
    setShowNew(false)
    setSelectedId(documents[0].id)
    setToast(`"${newTitle}" created`)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
          />
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowNew(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            New Document
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCopilotPanel(!copilotPanel)}
            className="gap-1.5"
          >
            <Layers className="h-3.5 w-3.5" />
            Copilot
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 gap-4">
          {/* Document list */}
          <div className="w-72 shrink-0 border-r border-border flex flex-col bg-card">
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Documents</span>
              </div>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1 text-xs">All ({documents.length})</TabsTrigger>
                  <TabsTrigger value="starred" className="flex-1 text-xs">
                    <Star className="h-3 w-3 inline mr-1" />
                    Starred ({documents.filter((d) => d.starred).length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="flex-1">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  No documents found
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedId === doc.id
                          ? "bg-accent/50 border-l-2 border-l-primary"
                          : "hover:bg-muted/50"
                      } ${doc.starred ? "bg-muted/20" : ""}`}
                      onClick={() => setSelectedId(doc.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {doc.starred ? (
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${selectedId === doc.id ? "text-primary" : ""}`}>
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {doc.tags.slice(0, 2).map((t) => (
                              <Badge key={t} variant="secondary" className="text-[10px] h-4 px-1">
                                {t}
                              </Badge>
                            ))}
                            {doc.tags.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">+{doc.tags.length - 2}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {doc.author} · Updated {doc.updated}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="h-6 w-6 ml-auto">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedId(doc.id)}>
                              <Pencil className="h-3 w-3 mr-1.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { documents.find((d) => d.id === doc.id)!.starred = !doc.starred; setSelectedId(doc.id) }}>
                              <Star className="h-3 w-3 mr-1.5" />
                              {doc.starred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-3 w-3 mr-1.5" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-3 w-3 mr-1.5" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-3 w-3 mr-1.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Document editor */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
            {selectedDoc ? (
              <>
                {/* Editor header */}
                <div className="flex items-center justify-between p-3 border-b bg-card">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">Editing</span>
                    </div>
                    <p className="text-sm font-medium mt-0.5">{selectedDoc.title}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => {
                      const d = documents.find((doc) => doc.id === selectedDoc.id)
                      if (d) { d.starred = !d.starred; setSelectedId(selectedDoc.id) }
                    }}>
                      <Star className={`h-3.5 w-3.5 ${selectedDoc.starred ? "fill-amber-400 text-amber-400" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Copilot panel */}
                {copilotPanel && (
                  <div className="border-b bg-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <span className="text-sm font-medium">AI Copilot</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Suggested: Add a "Souls" section with hamza-ali and jake-abdo profiles.</p>
                      <p>Tip: Link to pipeline.db for live stats.</p>
                      <Button variant="outline" size="sm" className="mt-1 h-6 text-xs">
                        Apply suggestion
                      </Button>
                    </div>
                  </div>
                )}

                {/* Editor body */}
                <div className="flex-1 overflow-auto">
                  <Textarea
                    value={selectedDoc.content}
                    onChange={(e) => {
                      const d = documents.find((doc) => doc.id === selectedDoc.id)
                      if (d) { d.content = e.target.value; d.updated = new Date().toLocaleDateString() }
                    }}
                    className="w-full h-full p-6 font-mono text-sm leading-relaxed resize-none bg-transparent"
                    placeholder="Start writing..."
                    spellCheck
                  />
                </div>

                {/* Editor footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>Last edited {selectedDoc.updated}</span>
                    <span>·</span>
                    <span>{selectedDoc.content.split("\n").length} lines</span>
                    <span>·</span>
                    <span>{selectedDoc.content.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-30 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Select a document or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New document dialog */}
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Document title"
                  className="mt-1"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tags (comma-separated)</Label>
                <Input
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="product, spec, notes"
                  className="mt-1"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Content</Label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="# Start typing..."
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()} className="ml-auto">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toast */}
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

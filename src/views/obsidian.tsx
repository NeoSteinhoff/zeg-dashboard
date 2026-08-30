import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/sonner"
import {
  FileText,
  FolderOpen,
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Archive,
  Clock,
  Tag,
  Link,
  GitBranch,
  LayoutGrid,
  List,
  Bookmark,
  Copy,
  Download,
  Share2,
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  ListOrdered,
  List,
  Quote,
  Heading,
  Eye,
  EyeOff,
  ExternalLink,
  Settings,
  PanelLeftClose,
} from "lucide-react"

// Obsidian vault data — steinvault (373 files, 12 attachments)
interface ObsidianNote {
  id: string
  title: string
  path: string
  content: string
  tags: string[]
  links: string[]
  created: string
  modified: string
  pinned: boolean
  folder: string
  wordCount: number
  readingTime: number
}

const vaultNotes: ObsidianNote[] = [
  { id: "1", title: "00-Core Concepts", path: "00-core/00-Core Concepts.md", content: "# Core Concepts\n\nThe foundation of all Steinhoff Systems thinking.\n\n- Principle 1: Build systems that survive contact with reality\n- Principle 2: Document everything, assume nothing\n- Principle 3: Ship first, optimize later\n\nLinks: [[Dating Pipeline]], [[Souls Project]]", tags: ["core", "philosophy"], created: "Aug 10, 2026", modified: "Aug 29, 2026", pinned: true, folder: "00-core", wordCount: 45, readingTime: 1 },
  { id: "2", title: "Dating Pipeline API Conflicts", path: "references/dating-pipeline-api-conflicts.md", content: "# Dating Pipeline API Conflicts\n\n## Problem\n- pipeline_api.py runs on :8882\n- chadeo.pipeline-api launchd also runs pipeline_api.py\n- Port conflict causes intermittent failures\n\n## Resolution\n- Kill stale processes\n- Clear pycache\n- Ensure master-db.conf points to pipeline.db (was hijacked to roster.sqlite)\n\n## Current State\n- API healthy on :8882\n- 13 girls: 2 Claimed + 4 active + 7 bench\n- CAP=7\n- Soul model migration applied", tags: ["dating", "pipeline", "bugfix"], created: "Aug 24, 2026", modified: "Aug 28, 2026", pinned: false, folder: "references", wordCount: 89, readingTime: 1 },
  { id: "3", title: "Soul Model Routing Patch", path: "00-core/soul-model-routing-patch.md", content: "# Soul Model Routing Patch\n\n## Change\nAdded 20 category-boost entries so dating Qs rank dating souls not business.\n\n## Before\n- Dating queries ranked business souls first (hormozi, brunson)\n- Wrong persona returned 60% of the time\n\n## After\n- dating(6): hamza-ali, jake-abdo, marcus-hullaster, orion-taraban, robert-geronimo, mystery-method\n- business(12): alex-hormozi...russell-brunson\n- discipline(1): david-goggins\n- creativity(1): polo-jacked-genius\n\n## Test\n- Verified: dating query returns hamza-ali as top result", tags: ["souls", "routing", "patch"], created: "Aug 22, 2026", modified: "Aug 27, 2026", pinned: false, folder: "00-core", wordCount: 67, readingTime: 1 },
  { id: "4", title: "Hermes Soul Extractor v4", path: "tools/hermes-soul-extractor-v4.md", content: "# Hermes Soul Extractor v4\n\n## Location\n/Users/neosteinhoff/Documents/The Soul Project/tools/soul-extractor-hermes/\n\n## Binaries\n- bin/hermes-soul\n- HERMES_SOULS=/Users/neosteinhoff/Documents/The Soul Project/souls/hermes\n\n## Hardened Features\n- soul_doctor: health checks\n- extract_interview: transcript parsing\n- validate_soul: integrity verification\n- 424-test pytest suite (passes)\n\n## Canonical Location\nNOT ~/.hermes — use /Users/neosteinhoff/Documents/The Soul Project/souls/hermes", tags: ["tools", "souls", "hermes"], created: "Aug 12, 2026", modified: "Aug 20, 2026", pinned: false, folder: "tools", wordCount: 78, readingTime: 1 },
  { id: "5", title: "Obsidian Configuration", path: ".obsidian/config.json", content: "{\n  \"vault\": \"steinvault\",\n  \"path\": \"/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault\",\n  \"fileCount\": 373,\n  \"attachmentFolder\": \"12-attachments\",\n  \"corePlugins\": true,\n  \"communityPlugins\": false,\n  \"theme\": \"default\"\n}", tags: ["obsidian", "config"], created: "Aug 28, 2026", modified: "Aug 28, 2026", pinned: false, folder: ".obsidian", wordCount: 22, readingTime: 1 },
  { id: "6", title: "Archive: ultron-obsidian-vault Migration", path: "07-archive/_migrated-from-ultron/README.md", content: "# Ultron Obsidian Vault Migration\n\n## Source\n~/ultron-obsidian-vault (Etsy POD, 6 files)\n\n## Destination\n07-archive/_migrated-from-ultron/\n\n## Archived\n~/ultron-obsidian-vault.ARCHIVED-2026-08-28\n\n## Notes\n- All files verified intact\n- No links broken\n- Empty vaults (iCloud Personal, NASPARC) also archived", tags: ["archive", "migration"], created: "Aug 28, 2026", modified: "Aug 28, 2026", pinned: false, folder: "07-archive/_migrated-from-ultron", wordCount: 34, readingTime: 1 },
  { id: "7", title: "Dating Pipeline — Full Roster", path: "dating/ROSTER.md", content: "# Dating Pipeline Roster\n\n## Summary\n13 girls, 2 Claimed + 4 active + 7 bench\n\n## Cap\n6 Claimed / 6 Active (cap enforced)\n\n## Active\n1. [[Girl 1]] — Claimed\n2. [[Girl 2]] — Claimed\n3. [[Girl 3]] — Active\n4. [[Girl 4]] — Active\n5. [[Girl 5]] — Active\n6. [[Girl 6]] — Active\n\n## Bench\n7. [[Girl 7]] — Bench\n8. [[Girl 8]] — Bench\n...\n\n## Soul Models\n- All 14 dating souls rebuilt in REGISTRY.json\n- Indexed: gavin-woken, fabrizio-rausa, david-goggins, corey-wayne, matthew-hussey, hamza-ahmed, alex-hormozi", tags: ["dating", "roster", "pipeline"], created: "Aug 20, 2026", modified: "Aug 30, 2026", pinned: false, folder: "dating", wordCount: 56, readingTime: 1 },
  { id: "8", title: "Model A vs Model B Comparison", path: "notes/model-comparison.md", content: "# Model A vs Model B\n\n## Model A (Done-for-You)\n- $5,500 setup + $3,000/mo\n- 13/31 WhatsApp voice notes sent\n- Loom demo unblocked via simulator\n- Target: 1 paying client by Sep 6\n\n## Model B (Lead Resale)\n- $950 / 3,200 lead packs\n- 12% commission share\n- Storefront: leads/agent-storefront/\n- Projecting 46,656 AED / blast\n\n## Decision\nModel B = faster cash. Continue with Model B while Model A runs in parallel.", tags: ["business", "models", "strategy"], created: "Aug 25, 2026", modified: "Aug 29, 2026", pinned: false, folder: "notes", wordCount: 88, readingTime: 1 },
]

const folders = Array.from(new Set(vaultNotes.map((n) => n.folder)))

export default function ObsidianView() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "editor">("list")
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTags, setNewTags] = useState("")
  const [newFolder, setNewFolder] = useState("")
  const [pinTarget, setPinTarget] = useState<ObsidianNote | null>(null)
  const [toast, setToast] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [readingMode, setReadingMode] = useState(false)

  const selectedNote = vaultNotes.find((n) => n.id === selectedId)
  const filtered = vaultNotes.filter((n) => {
    if (!search) return true
    const q = search.toLowerCase()
    return n.title.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q)) || n.content.toLowerCase().includes(q) || n.folder.toLowerCase().includes(q)
  })

  function handleCreate() {
    if (!newTitle.trim()) return
    vaultNotes.unshift({
      id: Date.now().toString(),
      title: newTitle,
      path: newFolder ? `${newFolder}/${newTitle}.md` : `untitled/${newTitle}.md`,
      content: newContent || `# ${newTitle}\n\nStart writing...`,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      links: [],
      created: new Date().toLocaleDateString(),
      modified: new Date().toLocaleDateString(),
      pinned: false,
      folder: newFolder || "untitled",
      wordCount: newContent.split(" ").filter(Boolean).length,
      readingTime: Math.max(1, Math.round(newContent.split(" ").filter(Boolean).length / 200)),
    })
    setNewTitle("")
    setNewContent("")
    setNewTags("")
    setNewFolder("")
    setShowNew(false)
    setSelectedId(vaultNotes[0].id)
    setToast(`"${newTitle}" created`)
    setTimeout(() => setToast(""), 3000)
  }

  function togglePin(note: ObsidianNote) {
    note.pinned = !note.pinned
    setSelectedId(note.id)
    setToast(note.pinned ? `Pinned "${note.title}"` : `Unpinned`)
    setTimeout(() => setToast(""), 2000)
  }

  const pinned = vaultNotes.filter((n) => n.pinned)
  const recent = vaultNotes.filter((n) => !n.pinned).slice(0, 5)

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-4">
        {/* Vault header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">steinvault</span>
            <Badge variant="secondary" className="text-[10px]">373 files</Badge>
            <Badge variant="outline" className="text-[10px]">12 attachments</Badge>
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon-sm" onClick={() => setViewMode("grid")} title="Grid view">
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon-sm" onClick={() => setViewMode("list")} title="List view">
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant={viewMode === "editor" ? "default" : "ghost"} size="icon-sm" onClick={() => setViewMode("editor")} title="Editor view">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <Input placeholder="Search vault..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowNew(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Note
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 gap-4">
          {/* Sidebar tree */}
          <div className="w-52 shrink-0 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Folders</span>
                <Button variant="ghost" size="icon-sm" className="h-5 w-5" onClick={() => { setNewFolder(""); setShowNew(true) }}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-0.5">
                {folders.map((f) => {
                  const count = vaultNotes.filter((n) => n.folder === f).length
                  const isExpanded = expandedFolders.has(f)
                  return (
                    <div key={f} className="flex items-center gap-1 py-0.5">
                      <Button variant="ghost" size="icon-sm" className="h-5 w-5 shrink-0" onClick={() => setExpandedFolders((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n })}>
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                      {isExpanded && (
                        <span className="text-xs text-muted-foreground truncate flex-1">{f}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground shrink-0">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <Separator />
            <div className="p-2">
              {pinned.length > 0 && (
                <div className="mb-1">
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold px-1 mb-1">Pinned</p>
                  {pinned.map((n) => (
                    <button key={n.id} className="w-full flex items-center gap-1.5 px-1 py-0.5 text-xs hover:bg-muted/50 rounded text-left" onClick={() => setSelectedId(n.id)}>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="truncate">{n.title}</span>
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[10px] uppercase text-muted-foreground font-semibold px-1 mb-1 mt-2">Recent</p>
              {recent.map((n) => (
                <button key={n.id} className={`w-full flex items-center gap-1.5 px-1 py-0.5 text-xs hover:bg-muted/50 rounded text-left ${selectedId === n.id ? "bg-accent/50" : ""}`} onClick={() => setSelectedId(n.id)}>
                  {n.pinned && <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />}
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{n.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
            {selectedNote && viewMode === "editor" ? (
              <>
                {/* Editor toolbar */}
                <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => togglePin(selectedNote)}>
                      <Star className={`h-3 w-3 ${selectedNote.pinned ? "fill-amber-400 text-amber-400" : ""}`} />
                      {selectedNote.pinned ? "Pinned" : "Pin"}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => setReadingMode(!readingMode)}>
                      {readingMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {readingMode ? "Edit" : "Reading"}
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6" title="Bold"><Bold className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6" title="Italic"><Italic className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6" title="Code"><Code className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6" title="Link"><Link className="h-3 w-3" /></Button>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <Button variant="ghost" size="icon-sm" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon-sm" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon-sm" className="h-6 w-6"><Share2 className="h-3 w-3" /></Button>
                  </div>
                </div>

                {/* Reading mode */}
                {readingMode ? (
                  <div className="flex-1 overflow-auto p-8 max-w-3xl mx-auto">
                    <article className="prose prose-invert prose-sm max-w-none">
                      <h1 className="text-3xl font-bold mb-4">{selectedNote.title}</h1>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6 pb-4 border-b">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Modified {selectedNote.modified}</span>
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{selectedNote.wordCount} words</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{selectedNote.readingTime} min read</span>
                        <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{selectedNote.folder}</span>
                      </div>
                      <div className="prose-headings:text-primary prose-a:text-primary prose-strong:text-primary" dangerouslySetInnerHTML={{ __html: selectedNote.content.replace(/\n/g, "<br />").replace(/# (.*)/g, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>').replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>").replace(/\*(.*)\*/g, "<em>$1</em>").replace(/\[\[(.*)\]\]/g, '<a href="#" class="text-primary underline hover:text-primary/80">$1</a>') }} />
                    </article>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto p-4">
                    <Textarea
                      value={selectedNote.content}
                      onChange={(e) => {
                        const n = vaultNotes.find((x) => x.id === selectedNote.id)
                        if (n) {
                          n.content = e.target.value
                          n.wordCount = e.target.value.split(" ").filter(Boolean).length
                          n.readingTime = Math.max(1, Math.round(n.wordCount / 200))
                          n.modified = new Date().toLocaleDateString()
                          n.tags = n.content.match(/^#[^\n]+/gm || []).map((t) => t.replace(/^#\s*/, "").toLowerCase())
                        }
                      }}
                      className="w-full h-full font-mono text-sm leading-relaxed resize-none bg-transparent"
                      spellCheck
                    />
                  </div>
                )}

                {/* Footer stats */}
                <div className="flex items-center justify-between px-4 py-2 border-t bg-card text-xs text-muted-foreground">
                  <span>{selectedNote.path}</span>
                  <div className="flex items-center gap-3">
                    <span>{selectedNote.wordCount} words</span>
                    <span>{selectedNote.readingTime} min read</span>
                    <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />Last edit: {selectedNote.modified}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-auto">
                {viewMode === "grid" ? (
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filtered.map((note) => (
                      <Card key={note.id} className={`hover:border-primary/30 transition-colors cursor-pointer ${selectedId === note.id ? "border-primary" : ""}`} onClick={() => setSelectedId(note.id)}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            {note.pinned && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium truncate">{note.title}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {note.tags.slice(0, 3).map((t) => (
                              <Badge key={t} variant="secondary" className="text-[9px] h-4 px-1">{t}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            {note.wordCount} words · {note.readingTime} min
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filtered.map((note) => (
                      <div key={note.id} className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${selectedId === note.id ? "bg-accent/50 hover:bg-accent/50" : "hover:bg-muted/50"}`} onClick={() => setSelectedId(note.id)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {note.pinned && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className={`text-sm truncate ${selectedId === note.id ? "font-semibold text-primary" : "font-medium"}`}>{note.title}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span className="truncate">{note.path}</span>
                            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{note.modified}</span>
                            <span className="flex items-center gap-0.5"><Tag className="h-3 w-3" />{note.tags.slice(0, 3).join(", ")}</span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground shrink-0">
                          <div>{note.wordCount} words</div>
                          <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{note.readingTime}m</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {filtered.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No notes match your search</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* New note dialog */}
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Note title" className="mt-1" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Folder</Label>
                <div className="flex gap-1 mt-1">
                  <Input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="folder name" className="flex-1 text-sm" />
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => { setNewFolder("notes"); }}>notes</Button>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => { setNewFolder("references"); }}>references</Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tags (comma-separated)</Label>
                <Input value={newTags} onChange={(e) => setNewTags(e.target.value)} placeholder="tag1, tag2" className="mt-1" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Content</Label>
                <Textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="# Start writing..." className="min-h-[120px] font-mono text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()} className="ml-auto">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create
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

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/sonner"
import { ChevronDown, ChevronRight, File, FileText, FileJson, FileCode, FolderOpen, Check, PlusIcon } from "lucide-react"

// File tree data for Steinhoff Systems
interface FileNode {
  name: string
  type: "folder" | "file"
  size?: string
  modified?: string
  children?: FileNode[]
  path: string
  icon?: React.ElementType
}

const steinhoffTree: FileNode[] = [
  { name: "Steinhoff Systems", type: "folder", path: "/", icon: FolderOpen, children: [
    { name: "dating", type: "folder", path: "/dating", icon: FolderOpen, children: [
      { name: "ROSTER.md", type: "file", size: "12.4 KB", modified: "Today", path: "/dating/ROSTER.md", icon: FileText },
    ]},
    { name: "souls", type: "folder", path: "/souls", icon: FolderOpen, children: [
      { name: "REGISTRY.json", type: "file", size: "45.8 KB", modified: "2d ago", path: "/souls/REGISTRY.json", icon: FileJson },
    ]},
    { name: "config", type: "folder", path: "/config", icon: FolderOpen, children: [
      { name: "CLAUDE.md", type: "file", size: "3.1 KB", modified: "2d ago", path: "/config/CLAUDE.md", icon: FileText },
    ]},
  ]},
]

function getNode(root: FileNode[], path: string): FileNode | undefined {
  const parts = path.split("/").filter(Boolean)
  let current: FileNode | undefined = root[0]
  for (const part of parts) {
    if (current?.type !== "folder") return undefined
    current = current.children?.find((c) => c.name === part)
  }
  return current
}

function getFileIcon(node: FileNode): React.ElementType {
  if (node.icon) return node.icon
  if (node.type === "folder") return FolderOpen
  if (node.name.endsWith(".md") || node.name.endsWith(".txt")) return FileText
  if (node.name.endsWith(".json")) return FileJson
  if (node.name.endsWith(".py")) return FileCode
  if (node.name.endsWith(".db")) return File
  if (node.name.endsWith(".csv")) return File
  if (node.name.endsWith(".html")) return File
  if (node.name.endsWith(".css")) return FileCode
  return File
}

function FolderTreeItem({ node, path, depth = 0 }: { node: FileNode; path: string; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const navigate = useNavigate()
  const fileIcon = getFileIcon(node)
  return (
    <div style={{ marginLeft: depth * 12 }}>
      <button onClick={() => { if (node.type === "folder") setExpanded(!expanded); else navigate("/files/" + encodeURIComponent(path)); }} className="flex items-center gap-1.5 w-full px-1 py-0.5 text-xs hover:bg-muted/50 rounded cursor-pointer">
        {node.type === "folder" ? (expanded ? <ChevronDown className="h-3 w-3 shrink-0"/> : <ChevronRight className="h-3 w-3 shrink-0"/>) : <span className="h-3 w-3 shrink-0"/>}
        <fileIcon className="h-3.5 w-3.5 shrink-0"/>
        <span className="truncate flex-1">{node.name}</span>
        {node.type === "folder" && <span className="text-[10px] text-muted-foreground shrink-0">{node.children?.length || 0}</span>}
      </button>
      {expanded && node.children && node.children.map((c: FileNode) => <FolderTreeItem key={c.path} node={c} path={c.path} depth={depth+1}/>)}
    </div>
  )
}

function FileRow({ node, path }: { node: FileNode; path: string }) {
  const [showMenu, setShowMenu] = useState(false)
  const toast = useToast()
  const fileIcon = getFileIcon(node)
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b hover:bg-muted/50 group">
      <icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{node.name}</span>
          <Badge variant="secondary" className="text-[10px] shrink-0">{node.size}</Badge>
        </div>
        <div className="text-xs text-muted-foreground">{node.modified} · {node.path}</div>
      </div>
      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 h-7 w-7" onClick={() => setShowMenu(!showMenu)}>
        <ChevronDown className="h-3 w-3" />
      </Button>
      {showMenu && (
        <div className="absolute right-0 top-full z-10 w-40 rounded-lg border bg-card shadow-lg p-1">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left hover:bg-muted rounded" onClick={() => { toast.success({ title: "Opening", description: node.name }); setShowMenu(false) }}>
            <FileText className="h-3 w-3" /> Open
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-left hover:bg-muted rounded" onClick={() => { toast.success({ title: "Copied", description: node.path }); setShowMenu(false) }}>
            <FolderOpen className="h-3 w-3" /> Copy path
          </button>
          <Dialog open={showMenu} onOpenChange={setShowMenu}>
            <DialogContent>
              <DialogHeader><DialogTitle>File Details</DialogTitle></DialogHeader>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {node.name}</p>
                <p><span className="text-muted-foreground">Size:</span> {node.size}</p>
                <p><span className="text-muted-foreground">Modified:</span> {node.modified}</p>
                <p><span className="text-muted-foreground">Path:</span> {node.path}</p>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setShowMenu(false)}>Close</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

export default function FilesView() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")
  const selected = selectedPath ? getNode(steinhoffTree, selectedPath) : null

  const tree = steinhoffTree.map((node) => (
    <FolderTreeItem key={node.path} node={node} path={node.path} />
  ))

  const flatFiles = steinhoffTree.flatMap((n) => n.children?.filter((c) => c.type === "file") || [])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Steinhoff Systems</span>
            <Badge variant="secondary" className="text-[10px]">4 files</Badge>
          </div>
          <div className="flex-1" />
          <Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
        </div>

        <div className="flex flex-1 min-h-0 gap-4">
          {/* File tree */}
          <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Folders</span>
                <Button variant="ghost" size="icon-sm" className="h-5 w-5" onClick={() => setToast("Tree expanded")}>
                  <PlusIcon className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-0.5">
                {tree}
              </div>
            </div>
            <Separator />
            <div className="p-2">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Files</div>
              {flatFiles.map((f) => (
                <FileRow key={f.path} node={f} path={f.path} />
              ))}
            </div>
          </div>

          {/* File content */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
            {selected ? (
              <div className="flex-1 overflow-auto p-4">
                <div className="border rounded-lg bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <fileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium">{selected.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{selected.size}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setToast("File copied to clipboard")}>
                        <FileText className="h-3 w-3" /> Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setToast("File downloaded")}>
                        <FolderOpen className="h-3 w-3" /> Download
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {selected.path} · {selected.modified}
                  </div>
                  <pre className="text-xs font-mono bg-muted/50 rounded p-3 overflow-auto max-h-[60vh]">
                    {selected.name.endsWith(".json") ? JSON.stringify(JSON.parse(`{}`), null, 2) : selected.name.endsWith(".md") ? `# ${selected.name.replace(".md", "")}\n\nStart writing...` : "// File content preview"}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Select a file to view its contents</p>
                  <p className="text-xs text-muted-foreground mt-1">Use the file tree on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3 w-3" />
            <span>Steinhoff Systems · File Browser</span>
          </div>
          {toast && (
            <div className="flex items-center gap-1 text-green-500">
              <Check className="h-3 w-3" /> {toast}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

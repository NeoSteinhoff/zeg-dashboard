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
import { ChevronDown, ChevronRight, File, FileText, FileJson, FileCode, FolderOpen } from "lucide-react"

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
  const icon = getFileIcon(node)
  return (
    <div style={{ marginLeft: depth * 12 }}>
      <button onClick={() => { if (node.type === "folder") setExpanded(!expanded); else navigate("/files/" + encodeURIComponent(path)); }} className="flex items-center gap-1.5 w-full px-1 py-0.5 text-xs hover:bg-muted/50 rounded cursor-pointer">
        {node.type === "folder" ? (expanded ? <ChevronDown className="h-3 w-3 shrink-0"/> : <ChevronRight className="h-3 w-3 shrink-0"/>) : <span className="h-3 w-3 shrink-0"/>}
        <icon className="h-3.5 w-3.5 shrink-0"/>
        <span className="truncate flex-1">{node.name}</span>
        {node.type === "folder" && <span className="text-[10px] text-muted-foreground shrink-0">{node.children?.length || 0}</span>}
      </button>
      {expanded && node.children && node.children.map((c: FileNode) => <FolderTreeItem key={c.path} node={c} path={c.path} depth={depth+1}/>)}
    </div>
  )
}

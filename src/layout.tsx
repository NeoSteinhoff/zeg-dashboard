import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Outlet } from "react-router-dom"
import {
  LayoutDashboard, Mail, FileText, FolderOpen,
  Calendar, Settings, LogIn, ChevronRight, Menu,
  Search, Send, Activity, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NavUser } from "@/components/nav-user"

type ViewKey = "dashboard" | "email" | "docs" | "files" | "obsidian" | "calendar" | "settings" | "auth"

interface NavItem {
  id: ViewKey
  label: string
  icon: React.ElementType
  badge?: number | string
  section?: string
}

const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  {
    section: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "email", label: "Email", icon: Mail, badge: 3 },
      { id: "docs", label: "Documents", icon: FileText },
    ],
  },
  {
    section: "Files",
    items: [
      { id: "files", label: "File Browser", icon: FolderOpen },
      { id: "obsidian", label: "Obsidian Vault", icon: FolderOpen },
    ],
  },
  {
    section: "Tools",
    items: [
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
]

const USER = {
  name: "Steinhoff",
  email: "me@steinhoff.group",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=steinhoff",
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentView = location.pathname.replace("/", "") as ViewKey || "dashboard"

  const NavContent = () => (
    <div className="flex flex-col gap-4 p-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.section}>
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.section}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = currentView === item.id
              const Icon = item.icon
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start gap-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => navigate(`/${item.id}`)}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-5 px-1.5 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item.badge} new
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-60 h-full border-r border-border bg-card">
          {/* Header */}
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Zegoro</span>
          </div>

          {/* Search */}
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search views..."
                className="pl-8 h-7 text-xs bg-muted/50"
                onChange={(e) => {
                  const q = e.target.value.toLowerCase()
                  for (const group of NAV_GROUPS) {
                    const found = group.items.find((i) =>
                      i.label.toLowerCase().includes(q)
                    )
                    if (found) { navigate(`/${found.id}`); break }
                  }
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Nav */}
          <ScrollArea className="flex-1">
            <NavContent />
          </ScrollArea>

          <Separator />

          {/* User + Quick access */}
          <div className="border-t border-border p-2 space-y-1">
            <NavUser user={USER} />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/dashboard")}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Quick Prompt</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Notifications</span>
              <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1.5 text-[10px]">
                2
              </Badge>
            </Button>
          </div>
        </aside>

        {/* Mobile sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-9 w-9 shrink-0 md:hidden"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 lg:w-60 p-0">
            <div className="flex h-14 items-center gap-2 border-b px-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Zegoro</span>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <NavContent />
            </ScrollArea>
            <Separator />
            <div className="border-t p-2">
              <NavUser user={USER} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

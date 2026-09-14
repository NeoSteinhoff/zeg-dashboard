import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

import { Activity, Mail, FileText, FolderOpen, Calendar, Settings, Menu, Users, Heart, Dumbbell, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

type ViewKey = "dashboard" | "email" | "docs" | "files" | "obsidian" | "calendar" | "settings" | "auth" | "circle" | "roster" | "gym" | "ceo"

interface NavItem {
  id: ViewKey
  label: string
  icon: React.ElementType
  badge?: number | string
}

const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  { section: "Main", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "email", label: "Email", icon: Mail, badge: 3 },
    { id: "docs", label: "Documents", icon: FileText },
  ]},
  { section: "Files", items: [
    { id: "files", label: "File Browser", icon: FolderOpen },
    { id: "obsidian", label: "Obsidian Vault", icon: FolderOpen },
  ]},
  { section: "Tools", items: [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "circle", label: "Circle", icon: Users },
    { id: "roster", label: "Roster", icon: Heart },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "ceo", label: "CEO", icon: Briefcase },
  ]},
]

const USER = {
  name: "Steinhoff",
  email: "me@steinhoff.group",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=steinhoff",
}

function NavItemComp({ item, navigate, location }: { item: NavItem; navigate: ReturnType<typeof useNavigate>; location: ReturnType<typeof useLocation> }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={location.pathname === `/${item.id}`} onClick={() => navigate(`/${item.id}`)}>
        <item.icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
        {item.badge !== undefined && (
          <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1.5 text-[10px]">
            {item.badge}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function ZegSidebar({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { setOpenMobile } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Desktop sidebar */}
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarHeader className="h-14 border-b border-sidebar-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <span className="ml-2 text-sm font-semibold tracking-tight">Zegoro</span>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <SidebarSeparator />
            <ScrollArea className="flex-1">
              <SidebarMenu>
                {NAV_GROUPS.map((group) => (
                  <div key={group.section} className="space-y-1 px-2">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.section}
                      </span>
                    </div>
                    {group.items.map((item) => (
                      <NavItemComp key={item.id} item={item} navigate={navigate} location={location} />
                    ))}
                  </div>
                ))}
              </SidebarMenu>
            </ScrollArea>
            <SidebarSeparator />
            <div className="space-y-1 p-2">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => navigate("/prompt-center")}>
                <Mail className="h-3.5 w-3.5" />
                <span>Quick Prompt</span>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>Notifications</span>
                <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1.5 text-[10px]">2</Badge>
              </Button>
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-2">
            <NavUser user={USER} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Mobile sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto h-9 w-9 shrink-0 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 lg:w-60 p-0">
            <SidebarHeader className="h-14 border-b border-sidebar-border">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-semibold">Zegoro</span>
            </SidebarHeader>
            <SidebarSeparator />
            <ScrollArea className="flex-1">
              <SidebarMenu>
                {NAV_GROUPS.map((group) => (
                  <div key={group.section} className="space-y-1 px-2">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group.section}</span>
                    </div>
                    {group.items.map((item) => (
                      <NavItemComp key={item.id} item={item} navigate={navigate} location={location} />
                    ))}
                  </div>
                ))}
              </SidebarMenu>
            </ScrollArea>
            <SidebarSeparator />
            <div className="space-y-1 p-2">
              <NavUser user={USER} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content area — children (page) renders here */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

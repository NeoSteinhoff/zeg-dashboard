import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Activity, LayoutDashboard, Mail, FileText, FolderOpen, FileCode, Calendar, Settings, Send, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
} from "@/components/ui/sidebar"

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Email", url: "/email", icon: Mail },
  { title: "Documents", url: "/docs", icon: FileText },
  { title: "Files", url: "/files", icon: FolderOpen },
  { title: "Obsidian", url: "/obsidian", icon: FileCode },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-14 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                <Activity className="h-4 w-4 shrink-0" />
                <span className="text-sm font-semibold">Zegoro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {nav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => navigate("/prompt-center")}>
            <Send className="h-3.5 w-3.5 shrink-0" />
            <span>Quick Prompt</span>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
            <Bell className="h-3.5 w-3.5 shrink-0" />
            <span>Notifications</span>
            <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1.5 text-[10px]">2</Badge>
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser user={{ name: "Steinhoff", email: "me@steinhoff.group", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=steinhoff" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

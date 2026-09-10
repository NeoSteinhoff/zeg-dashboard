import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ZegSidebar as Sidebar } from "./layout"

const DashboardPage = lazy(() => import("./views/dashboard"))
const PromptCenterPage = lazy(() => import("./views/prompt-center"))
const EmailPage = lazy(() => import("./views/email"))
const DocsPage = lazy(() => import("./views/docs"))
const FilesPage = lazy(() => import("./views/files"))
const ObsidianPage = lazy(() => import("./views/obsidian"))
const CalendarPage = lazy(() => import("./views/calendar"))
const SettingsPage = lazy(() => import("./views/settings"))
const AuthPage = lazy(() => import("./views/auth"))

const fallback =
  <div className="flex items-center justify-center h-full">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  </div>

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <SidebarProvider>
        <TooltipProvider>
          <Sidebar />
          <Outlet />
          <Toaster />
        </TooltipProvider>
      </SidebarProvider>
    ),
    children: [
      { index: true, element: <Suspense fallback={fallback}><DashboardPage /></Suspense> },
      { path: "dashboard", element: <Suspense fallback={fallback}><DashboardPage /></Suspense> },
      { path: "prompt-center", element: <Suspense fallback={fallback}><PromptCenterPage /></Suspense> },
      { path: "email", element: <Suspense fallback={fallback}><EmailPage /></Suspense> },
      { path: "docs", element: <Suspense fallback={fallback}><DocsPage /></Suspense> },
      { path: "files", element: <Suspense fallback={fallback}><FilesPage /></Suspense> },
      { path: "obsidian", element: <Suspense fallback={fallback}><ObsidianPage /></Suspense> },
      { path: "calendar", element: <Suspense fallback={fallback}><CalendarPage /></Suspense> },
      { path: "settings", element: <Suspense fallback={fallback}><SettingsPage /></Suspense> },
      { path: "auth", element: <Suspense fallback={fallback}><AuthPage /></Suspense> },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={routes} />
}

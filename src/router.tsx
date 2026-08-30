import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "./layout"

const DashboardPage = lazy(() => import("./views/dashboard"))
const EmailPage = lazy(() => import("./views/email"))
const DocsPage = lazy(() => import("./views/docs"))
const FilesPage = lazy(() => import("./views/files"))
const ObsidianPage = lazy(() => import("./views/obsidian"))
const CalendarPage = lazy(() => import("./views/calendar"))
const SettingsPage = lazy(() => import("./views/settings"))
const AuthPage = lazy(() => import("./views/auth"))

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "email",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <EmailPage />
          </Suspense>
        ),
      },
      {
        path: "docs",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <DocsPage />
          </Suspense>
        ),
      },
      {
        path: "files",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <FilesPage />
          </Suspense>
        ),
      },
      {
        path: "obsidian",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <ObsidianPage />
          </Suspense>
        ),
      },
      {
        path: "calendar",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <CalendarPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: "auth",
        element: (
          <Suspense
            fallback={<div className="flex items-center justify-center h-full"><div className="flex flex-col items-center gap-2"><div className="h-8 w-8 animate-pulse rounded-lg bg-muted" /><div className="h-4 w-24 animate-pulse rounded bg-muted" /></div></div>}
          >
            <AuthPage />
          </Suspense>
        ),
      },
    ],
  },
])

export default function Router() {
  return (
    <RouterProvider router={routes}>
      <Toaster />
    </RouterProvider>
  )
}
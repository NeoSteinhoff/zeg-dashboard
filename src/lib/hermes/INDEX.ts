import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Check, Zap, Shield, Settings as SettingsIcon, Bell, Web, Layers, Database } from "lucide-react"

// Hermes UI Library — catalog of all components provided to the Zeg Dashboard
// Each component below is available for reuse across views.
// Components are stored in src/lib/hermes/ as reference files.

export const HERMES_COMPONENTS = {
  // Core UI primitives (shadcn/base-nova)
  core: ["button", "input", "textarea", "label", "badge", "card", "separator",
         "scroll-area", "sheet", "dialog", "dropdown-menu", "tabs", "select",
         "switch", "checkbox", "progress", "skeleton", "spinner", "popover",
         "tooltip", "toast", "alert", "table", "avatar", "sonner"],

  // Advanced components added to this dashboard
  advanced: ["questionnaire", "calendar", "message", "tree-view"],

  // Views / subsystems
  views: ["dashboard", "email", "docs", "files", "obsidian", "calendar", "settings", "auth"],

  // Data sources integrated
  dataSources: {
    steinhoffSystems: "/Users/neosteinhoff/Documents/Steinhoff Systems",
    steinvault: "/Users/neosteinhoff/Documents/steinvault",
    souls: "/Users/neosteinhoff/Documents/The Soul Project/souls/hermes",
    pipelineDb: "/Users/neosteinhoff/Documents/Steinhoff Systems/dating/pipeline.db",
  }
} as const

// Component index — maps component name to its source file
export const COMPONENT_INDEX: Record<string, string> = {
  button: "@/components/ui/button",
  input: "@/components/ui/input",
  textarea: "@/components/ui/textarea",
  label: "@/components/ui/label",
  badge: "@/components/ui/badge",
  card: "@/components/ui/card",
  separator: "@/components/ui/separator",
  "scroll-area": "@/components/ui/scroll-area",
  sheet: "@/components/ui/sheet",
  dialog: "@/components/ui/dialog",
  "dropdown-menu": "@/components/ui/dropdown-menu",
  tabs: "@/components/ui/tabs",
  select: "@/components/ui/select",
  switch: "@/components/ui/switch",
  checkbox: "@/components/ui/checkbox",
  progress: "@/components/ui/progress",
  skeleton: "@/components/ui/skeleton",
  spinner: "@/components/ui/spinner",
  popover: "@/components/ui/popover",
  tooltip: "@/components/ui/tooltip",
  toast: "@/components/ui/toast",
  alert: "@/components/ui/alert",
  table: "@/components/ui/table",
  avatar: "@/components/ui/avatar",
  sonner: "@/components/ui/sonner",
  questionnaire: "@/components/ui/questionnaire",
  calendar: "@/components/ui/calendar",
  message: "@/components/ui/message",
  "tree-view": "@/components/ui/tree-view",
  // Views
  dashboard: "@/views/dashboard",
  email: "@/views/email",
  docs: "@/views/docs",
  files: "@/views/files",
  obsidian: "@/views/obsidian",
  calendar: "@/views/calendar",
  settings: "@/views/settings",
  auth: "@/views/auth",
} as const

// Hermes prompt library — reusable prompt templates
export const HERMES_PROMPTS = {
  composeEmail: "Compose a professional email to {recipient} about {topic}. Tone: {tone}. Key points: {points}",
  analyzePipeline: "Analyze the dating pipeline status. Current: {stage}. Metrics: {metrics}",
  generateLeadPack: "Generate a lead pack for {market} targeting {audience}. Price: {price}.",
  soulConsult: "Consult the {soul} persona about {topic}. Use their specific framework and vocabulary.",
  deployReport: "Generate a deployment report for {version} on {environment}. Changes: {changes}",
  statusUpdate: "Update status for {entity}. New state: {state}. Timestamp: {timestamp}",
} as const

// Hermes questionnaire templates
export const HERMES_QUESTIONNAIRES = {
  onboarding: {
    title: "New User Onboarding",
    description: "Set up your Zeg Dashboard preferences",
    items: [
      { name: "defaultView", required: true, prompt: "What's your default landing view?", 
        choices: [
          { value: "dashboard", label: "Dashboard" },
          { value: "email", label: "Email" },
          { value: "calendar", label: "Calendar" },
        ]
      },
      { name: "notifications", required: false, prompt: "Which notifications do you want?",
        choices: [
          { value: "email", label: "Email notifications" },
          { value: "prompts", label: "Prompt sent notifications" },
          { value: "both", label: "Both" },
        ]
      },
    ]
  },
  pipelineStatus: {
    title: "Pipeline Status Check",
    description: "Review the current dating pipeline state",
    items: [
      { name: "stage", required: true, prompt: "Which stage to review?",
        choices: [
          { value: "claimed", label: "Claimed" },
          { value: "active", label: "Active" },
          { value: "bench", label: "Bench" },
        ]
      },
      { name: "action", required: false, prompt: "What action?",
        choices: [
          { value: "export", label: "Export data" },
          { value: "reset", label: "Reset stage" },
          { value: "skip", label: "Skip" },
        ]
      },
    ]
  },
} as const

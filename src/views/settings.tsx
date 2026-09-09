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
import { Check, Zap, Shield, Settings as SettingsIcon, Bell, Layers, Database } from "lucide-react"

interface Setting {
  id: string
  label: string
  description: string
  type: "switch" | "text" | "select" | "slider"
  value: any
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  category: string
}

const SETTINGS: Setting[] = [
  { id: "darkMode", label: "Dark Mode", description: "Use dark theme across the dashboard", type: "switch", value: true, category: "appearance" },
  { id: "sidebarCollapsed", label: "Collapsed Sidebar", description: "Show only icons in sidebar (mobile default)", type: "switch", value: false, category: "appearance" },
  { id: "sidebarWidth", label: "Sidebar Width", description: "Desktop sidebar width in pixels", type: "slider", value: 200, min: 160, max: 400, step: 20, category: "appearance" },
  { id: "defaultView", label: "Default View", description: "View shown when opening the dashboard", type: "select", value: "dashboard", options: [{ value: "dashboard", label: "Dashboard" }, { value: "email", label: "Email" }, { value: "calendar", label: "Calendar" }], category: "general" },
  { id: "emailNotif", label: "Email Notifications", description: "Receive desktop notifications for new emails", type: "switch", value: true, category: "notifications" },
  { id: "promptNotif", label: "Prompt Sent Notifications", description: "Notify when a prompt is sent successfully", type: "switch", value: true, category: "notifications" },
  { id: "toastDuration", label: "Toast Duration", description: "How long toast messages stay visible (ms)", type: "slider", value: 5000, min: 1000, max: 10000, step: 500, category: "notifications" },
  { id: "resendApiKey", label: "Resend API Key", description: "API key for sending emails via Resend", type: "text", value: "", category: "integrations" },
  { id: "gmailSmtp", label: "Gmail SMTP", description: "Use Gmail SMTP for personal/replies (smtp.gmail.com:587)", type: "switch", value: true, category: "integrations" },
  { id: "personalEmail", label: "Personal Email", description: "Email address for sending personal messages", type: "text", value: "vivaan@steinhoff.group", category: "integrations" },
  { id: "promptHistory", label: "Prompt History", description: "Store sent prompts locally for reference", type: "switch", value: true, category: "souls" },
  { id: "soulRouting", label: "Soul Routing", description: "Route prompts through soul model (20 category-boost)", type: "switch", value: true, category: "souls" },
  { id: "maxSuggestions", label: "Max Copilot Suggestions", description: "Maximum number of AI suggestions to show", type: "slider", value: 5, min: 1, max: 20, step: 1, category: "souls" },
  { id: "pipelineDbPath", label: "Pipeline DB Path", description: "Path to dating pipeline database", type: "text", value: "/Users/neosteinhoff/Documents/Steinhoff Systems/dating/pipeline.db", category: "pipeline" },
  { id: "pipelineApiPort", label: "Pipeline API Port", description: "Port for pipeline_api.py server", type: "text", value: "8882", category: "pipeline" },
  { id: "capLimit", label: "CAP Limit", description: "Maximum girls per stage (Claimed/Active)", type: "text", value: "6", category: "pipeline" },
  { id: "soulExtractorPath", label: "Soul Extractor Path", description: "Path to Hermes Soul Extractor v4", type: "text", value: "/Users/neosteinhoff/Documents/The Soul Project/tools/soul-extractor-hermes", category: "souls" },
  { id: "obsidianVaultPath", label: "Obsidian Vault Path", description: "Path to steinvault", type: "text", value: "/Users/neosteinhoff/Documents/Steinhoff Systems/steinvault", category: "pipeline" },
  { id: "whatsappSimulator", label: "WhatsApp Simulator", description: "Use simulator for testing WhatsApp voice notes", type: "switch", value: true, category: "integrations" },
  { id: "loomDemoEnabled", label: "Loom Demo Enabled", description: "Show Loom demo in agent storefront when unblocked", type: "switch", value: true, category: "integrations" },
]

export default function SettingsView() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [textValues, setTextValues] = useState<Record<string, string>>({})
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({})
  const [saved, setSaved] = useState(false)

  const categories = Array.from(new Set(SETTINGS.map((s) => s.category)))

  function handleTextChange(id: string, value: string) {
    setTextValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSliderChange(id: string, value: number) {
    setSliderValues((prev) => ({ ...prev, [id]: value }))
  }

  function handleSave() {
    setSaved(true)
    toast.success({
      title: "Settings saved",
      description: "All preferences updated successfully",
      duration: 3000,
    })
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    setTextValues({})
    setSliderValues({})
    toast.success({
      title: "Defaults restored",
      description: "All settings reset to defaults",
      duration: 3000,
    })
  }

  const catIcon = (cat: string) => {
    const map: Record<string, typeof SettingsIcon> = {
      appearance: Shield,
      notifications: Bell,
      integrations: Globe,
      souls: Layers,
      pipeline: Database,
      general: SettingsIcon,
    }
    return map[cat] || SettingsIcon
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <Badge variant="secondary" className="text-[10px]">v2.0.0</Badge>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Live Configuration</AlertTitle>
          <AlertDescription>
            Settings are stored locally in memory. Changes take effect immediately.
          </AlertDescription>
        </Alert>

        <div className="flex flex-1 min-h-0 gap-6">
          <aside className="w-52 shrink-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex bg-muted/30 p-0.5">
                {categories.map((cat) => {
                  const CategoryIcon = catIcon(cat)
                  const isActive = activeTab === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 text-xs transition-colors ${isActive ? "bg-accent/50 text-accent-foreground rounded-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <CategoryIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleSave()}>
                <Check className="h-3.5 w-3.5" /> Save Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => handleReset()}>
                <Zap className="h-3.5 w-3.5" /> Reset Defaults
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Dashboard Status</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">v2.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">solar-pro4:free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">Nous Research</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 overflow-auto">
            {categories.map((cat) => (
              <div key={cat} className={`p-4 border-b last:border-b-0 ${activeTab === cat ? "" : "hidden"}`}>
                <div className="flex items-center gap-2 mb-3">
              {(() => {
                const Icon = catIcon(cat)
                return Icon === SettingsIcon ? (
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Icon className="h-4 w-4 text-muted-foreground" />
                )
              })()}
                  <h2 className="text-lg font-semibold">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                  <Badge variant="secondary" className="text-[10px]">{SETTINGS.filter((s) => s.category === cat).length}</Badge>
                </div>

                <div className="border rounded-lg divide-y">
                  {SETTINGS.filter((s) => s.category === cat).map((setting) => (
                    <div key={setting.id} className="flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{setting.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                      </div>

                      {setting.type === "switch" && (
                        <Switch
                          checked={setting.value as boolean}
                          onCheckedChange={(checked) => {
                            const found = SETTINGS.find((s) => s.id === setting.id)
                            if (found) found.value = checked
                          }}
                        />
                      )}

                      {setting.type === "text" && (
                        <Input
                          value={textValues[setting.id] || (setting.value as string) || ""}
                          onChange={(e) => handleTextChange(setting.id, e.target.value)}
                          className="w-64 h-8 text-xs"
                          placeholder="Enter value..."
                        />
                      )}

                      {setting.type === "select" && (
                        <Select
                          value={(setting.value as string) || ""}
                          onValueChange={(v) => {
                            const found = SETTINGS.find((s) => s.id === setting.id)
                            if (found) found.value = v
                          }}
                        >
                          <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {setting.type === "slider" && (
                        <div className="flex items-center gap-3 w-48">
                          <Input
                            type="number"
                            value={sliderValues[setting.id] ?? setting.value}
                            onChange={(e) => {
                              const v = parseInt(e.target.value)
                              if (!isNaN(v)) handleSliderChange(setting.id, v)
                            }}
                            className="w-20 h-8 text-xs text-right"
                            min={setting.min}
                            max={setting.max}
                          />
                          <span className="text-xs text-muted-foreground">
                            {setting.min} — {setting.max}
                          </span>
                          <Progress
                            value={((sliderValues[setting.id] ?? setting.value) - (setting.min || 0)) /
                              ((setting.max || 100) - (setting.min || 0)) * 100}
                            className="h-1.5 flex-1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </main>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Zegoro · Settings · v2.0.0</span>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-green-500">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

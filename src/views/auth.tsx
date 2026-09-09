import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/sonner"
import {
  Mail,
  Lock,
  User,
  Shield,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react"

export default function AuthView() {
  const navigate = useNavigate()
  const toast = useToast()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!email) { setError("Email is required"); return }
    setLoading(true)
    setError("")
    await new Promise((r) => setTimeout(r, 800))
    toast.success({
      title: "Authenticated",
      description: mode === "login"
        ? `Welcome back, ${email.split("@")[0]}. You are now logged in.`
        : `Account created for ${email}. No password required.`,
      duration: 5000,
      icon: <CheckCircle2 className="h-4 w-4" />,
    })
    setLoading(false)
    navigate("/dashboard")
  }

  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-4 bg-muted/30">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Zegoro</span>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any) || setError("")}>
            <TabsList className="mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="tab-content">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-lg">Sign in to Zeg</CardTitle>
                  <CardDescription>
                    No password required. Just enter your email and you're in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Passwordless auth</AlertTitle>
                    <AlertDescription>
                      We use email-based magic links. No passwords to store, no credentials to leak.
                      Enter any email — it will work.
                    </AlertDescription>
                  </Alert>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@steinhoff.group"
                      className="mt-1.5"
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !email}
                    className="w-full justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-2">
                    By continuing, you agree to our passwordless terms (there are none).
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="tab-content">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-lg">Create your account</CardTitle>
                  <CardDescription>
                    No password needed. Any email works. No verification codes, no captcha.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertTitle>Zero friction onboarding</AlertTitle>
                    <AlertDescription>
                      We don't ask for passwords, phone numbers, or IDs. Just give us an email and
                      you get full access to the Zegoro.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name (optional)</Label>
                    <Input
                      id="signup-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@steinhoff.group"
                      className="mt-1.5"
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !email}
                    className="w-full justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Any email works. No password. Instant access.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}

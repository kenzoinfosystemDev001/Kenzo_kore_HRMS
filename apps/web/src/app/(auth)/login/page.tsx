"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Lock, 
  Globe, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@kenzo.com",
      password: "Admin@123",
      rememberMe: true,
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setServerError(null)
    try {
      const result = await login(data.email, data.password)
      if (!result.success) {
        setServerError(result.error || "Login failed")
      }
    } catch (err) {
      setServerError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 border-b border-border bg-slate-950/70 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-primary to-cyan-400 text-foreground font-bold text-xl shadow-lg ring-1 ring-border">
            K
          </div>
          <span>Kenzo<span className="text-primary font-normal">HRMS</span></span>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto p-6 lg:p-12 items-center gap-12">
        
        {/* Left Column - High-contrast Showcase */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            Enterprise Workforce Management Solution
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Welcome Back to <span className="hero-gradient-text">Kenzo HRMS</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Streamline attendance, automated payroll, employee self-service, leave workflows, and performance reviews in one unified multi-tenant platform.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-border p-3 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Multi-Tenant Enterprise RBAC</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-border p-3 rounded-xl">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-Time Biometric Clock In</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-border p-3 rounded-xl">
              <Award className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>1-Click PDF Payslip Generator</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-border p-3 rounded-xl">
              <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>360° Appraisals & Performance</span>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Card */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl glass-card p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-cyan-400" />

            <div className="space-y-2 text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Account Login</h2>
              <p className="text-xs text-muted-foreground">Sign in to access your HRMS workspace</p>
            </div>

            {/* Static Credentials Info */}
            <div className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs space-y-2">
              <div className="font-semibold text-primary flex items-center justify-between">
                <span>Demo Credentials:</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-muted-foreground">
                <div className="bg-slate-950/60 p-2 rounded-md border border-border">
                  <div className="font-medium text-foreground mb-1">Admin (Ankit Sethi - EMP-1001)</div>
                  <div>admin@kenzo.com / Admin@123</div>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-md border border-border">
                  <div className="font-medium text-foreground mb-1">Employee (Sujal Kumar - EMP-1002)</div>
                  <div>employee@kenzo.com / Emp@123</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                  {serverError}
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Work Email</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="bg-slate-950/80 border-border text-foreground focus:border-primary h-10"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:text-primary/80">Forgot password?</a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-950/80 border-border text-foreground focus:border-primary h-10"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 py-1">
                <Checkbox id="login-remember" {...register("rememberMe")} className="border-border data-[state=checked]:bg-primary" />
                <label htmlFor="login-remember" className="text-xs font-medium text-muted-foreground cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 shadow-lg text-sm"
              >
                {isLoading ? "Authenticating..." : "Sign In to HRMS"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-20 border-t border-border bg-slate-950/90 py-4 px-6 text-center text-xs text-muted-foreground max-w-7xl w-full mx-auto">
        © 2026 Kenzo HRMS. Smart Workforce Management for Modern Enterprises.
      </footer>
    </div>
  )
}

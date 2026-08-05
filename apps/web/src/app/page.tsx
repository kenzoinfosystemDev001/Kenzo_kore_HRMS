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

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
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
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 800)
  }

  const fillQuickLogin = (email: string, pass: string) => {
    setValue("email", email)
    setValue("password", pass)
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white font-bold text-xl shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            K
          </div>
          <span>Kenzo<span className="text-blue-500 font-normal">HRMS</span></span>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] tracking-wider uppercase font-semibold">
            Enterprise v2.0
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
            Dashboard Preview
          </Link>
          <Button 
            onClick={() => router.push("/dashboard")} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 font-medium"
          >
            Launch System <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto p-6 lg:p-12 items-center gap-12">
        
        {/* Left Column - Showcase & Value Prop */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            Smart Workforce Management for Modern Enterprises
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Empower Your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Global Workforce</span> With Intelligence.
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
              Complete multi-tenant HRMS platform automating the full employee lifecycle—from onboarding and biometric attendance to AI-driven payroll, performance appraisals, and enterprise analytics.
            </p>
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-3 gap-4 border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl">
            <div className="space-y-1 text-center sm:text-left border-r border-slate-800 pr-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">1,240+</div>
              <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <Users className="h-3 w-3 text-blue-400" /> Active Employees
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left border-r border-slate-800 pr-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.9%</div>
              <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Payroll Accuracy
              </div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50+</div>
              <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <Globe className="h-3 w-3 text-indigo-400" /> ERP Integrations
              </div>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Multi-Tenant & Role-Based RBAC</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-Time Biometric & GPS Clock In</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <Award className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>1-Click Payslip & Tax Calculations</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>360° Appraisals & OKR Tracking</span>
            </div>
          </div>

          {/* CHRO Testimonial */}
          <div className="border border-slate-800/80 bg-slate-900/40 p-5 rounded-2xl flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold shrink-0 ring-1 ring-blue-500/30">
              SD
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-200 italic font-medium text-sm">
                &quot;Kenzo HRMS transformed our 1,200+ global employee operations. Attendance sync and payslip downloads take seconds!&quot;
              </p>
              <p className="text-slate-400 font-semibold">Sofia Davis — Chief HR Officer, GlobalTech</p>
            </div>
          </div>
        </div>

        {/* Right Column - Sleek Authentication & Portal Access */}
        <div className="lg:col-span-5 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Top Card Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

            <div className="space-y-2 text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">System Portal Login</h2>
              <p className="text-xs text-slate-400">Sign in to access your HRMS dashboard and employee self-service.</p>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
              <div className="font-semibold text-blue-300 flex items-center justify-between">
                <span>⚡ Instant Quick Demo Login:</span>
                <Badge className="bg-blue-500 text-white text-[9px]">Click to fill</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => fillQuickLogin("admin@kenzo.com", "Admin@123")}
                  className="text-[11px] h-8 bg-slate-950/60 border-slate-800 text-slate-200 hover:border-blue-500 hover:text-white"
                >
                  Super Admin
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => fillQuickLogin("employee@kenzo.com", "Emp@123")}
                  className="text-[11px] h-8 bg-slate-950/60 border-slate-800 text-slate-200 hover:border-blue-500 hover:text-white"
                >
                  Employee Self-Service
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Work Email</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="bg-slate-950/80 border-slate-800 text-white focus:border-blue-500 h-10"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-300">Password</Label>
                  <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300">Forgot password?</a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-950/80 border-slate-800 text-white focus:border-blue-500 h-10"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>

              <div className="flex items-center space-x-2 py-1">
                <Checkbox id="home-remember" {...register("rememberMe")} className="border-slate-700 data-[state=checked]:bg-blue-600" />
                <label htmlFor="home-remember" className="text-xs font-medium text-slate-400 cursor-pointer">
                  Keep me signed in for 30 days
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold h-11 shadow-lg shadow-blue-600/30 text-sm"
              >
                {isLoading ? "Authenticating..." : "Sign In to HRMS"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            {/* Direct Dashboard Access Option */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/dashboard")}
                className="text-xs text-slate-400 hover:text-white w-full"
              >
                Explore Live Demo Dashboard Directly <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/80 bg-slate-950/90 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto">
        <div>© 2026 Kenzo HRMS. Enterprise Multi-Tenant Platform.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-400" /> SSL Encrypted</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-blue-400" /> SOC2 Type II Certified</span>
        </div>
      </footer>
    </div>
  )
}

"use client"

import * as React from "react"
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
import { useAuth } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function HomePage() {
  const router = useRouter()
  const { login, isLoading: authLoading, user } = useAuth()
  const [loginError, setLoginError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setLoginError(null)
    const res = await login(data.email, data.password)
    if (!res.success && res.error) {
      setLoginError(res.error)
    }
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

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Multi-Tenant RBAC</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-Time Biometric Clock In</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <Award className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>1-Click Payslip Generator</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900/40 border border-slate-800/50 px-3 py-2 rounded-xl">
              <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>360° Appraisals & OKR Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Column - Sleek Authentication & Portal Access */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Top Card Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

            <div className="space-y-2 text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">System Portal Login</h2>
              <p className="text-xs text-slate-400">Sign in to access your HRMS dashboard and employee self-service.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Work Email</Label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="bg-slate-950/80 border-slate-800 text-white focus:border-blue-500 h-10"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
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
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center space-x-2 py-1">
                <Checkbox id="home-remember" {...register("rememberMe")} className="border-slate-700 data-[state=checked]:bg-blue-600" />
                <label htmlFor="home-remember" className="text-xs font-medium text-slate-400 cursor-pointer">
                  Keep me signed in for 30 days
                </label>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-xs text-red-500 text-center">{loginError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold h-11 shadow-lg shadow-blue-600/30 text-sm"
              >
                {authLoading ? "Authenticating..." : "Sign In to HRMS"}
                {!authLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900/90 px-2 text-slate-500">Demo Credentials</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-col bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs">
                  <span className="text-slate-300 font-semibold mb-1">Ankit Sethi - CEO (Admin)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>admin@kenzo.com</span>
                    <span>Admin@123</span>
                  </div>
                </div>
                <div className="flex flex-col bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs">
                  <span className="text-slate-300 font-semibold mb-1">Sujal Kumar - Architect (Employee)</span>
                  <div className="flex justify-between text-slate-400">
                    <span>employee@kenzo.com</span>
                    <span>Emp@123</span>
                  </div>
                </div>
              </div>
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

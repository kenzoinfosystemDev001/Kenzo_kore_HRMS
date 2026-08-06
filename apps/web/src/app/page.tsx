/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowRight, Lock, ShieldCheck } from "lucide-react"

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

export default function HomePage() {
  const { login, isLoading: authLoading } = useAuth()
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-white">
          <img src="/logo.png" alt="Kenzo HRMS Logo" className="h-10 w-10 object-contain rounded-xl" />
          <span>Kenzo<span className="text-blue-500 font-normal">HRMS</span></span>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] tracking-wider uppercase font-semibold">
            Enterprise v2.0
          </Badge>
        </div>
      </header>

      {/* Main Container - Centered Login Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top Card Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

          {/* Logo & Title Header */}
          <div className="flex flex-col items-center text-center mb-6 space-y-2">
            <img src="/logo.png" alt="Kenzo HRMS Logo" className="h-14 w-14 object-contain rounded-2xl mb-1 shadow-lg shadow-blue-500/20 ring-1 ring-white/10" />
            <h2 className="text-2xl font-bold text-white tracking-tight">System Portal Login</h2>
            <p className="text-xs text-slate-400">Sign in to access your HRMS dashboard and workforce self-service.</p>
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
        </motion.div>
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

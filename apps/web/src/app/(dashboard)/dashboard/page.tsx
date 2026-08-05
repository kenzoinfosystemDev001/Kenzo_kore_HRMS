"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Clock,
  CalendarDays,
  FileCheck,
  FolderKanban,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  Edit,
  Trash2,
  Plus
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  statCards,
  attendanceData,
  leaveRequests as initialLeaveRequests,
  departmentData,
} from "@/features/dashboard/data"

const COLORS = ["#3B82F6", "#6366F1", "#EC4899", "#8B5CF6", "#10B981", "#F59E0B", "#06B6D4"]

export default function DashboardPage() {
  const [leaveQueue, setLeaveQueue] = useState(initialLeaveRequests)

  const handleApprove = (id: number) => {
    setLeaveQueue(leaveQueue.filter(r => r.id !== id))
  }

  const handleReject = (id: number) => {
    setLeaveQueue(leaveQueue.filter(r => r.id !== id))
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Kenzo HRMS Executive Control Center
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Good Morning, <span className="hero-gradient-text">Sujal</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Here is real-time intelligence for Kenzo Technologies global workforce.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" /> August 2026
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
            <Zap className="mr-2 h-4 w-4" /> AI Insights Run
          </Button>
        </div>
      </div>

      {/* 5 Stat Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="glass-card hover:border-primary/40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">{card.value}</div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {card.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Middle Grid: Charts & Queues */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Attendance Area Chart */}
        <Card className="col-span-12 lg:col-span-7 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Attendance Analytics</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Daily present, late, and leave headcount trends.</CardDescription>
            </div>
            <Badge variant="outline">August 2026</Badge>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Area type="monotone" dataKey="present" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Requests Queue with Admin Actions */}
        <Card className="col-span-12 lg:col-span-5 glass-card flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Pending Approvals</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Admin review and leave approval queue.</CardDescription>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">{leaveQueue.length} Pending</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaveQueue.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">All pending requests approved!</div>
            ) : (
              leaveQueue.slice(0, 4).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">{req.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{req.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{req.type} • {req.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="default" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5" onClick={() => handleApprove(req.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] text-rose-600 border-rose-200 dark:border-rose-800 hover:bg-rose-50 px-2" onClick={() => handleReject(req.id)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="border-t pt-3">
            <Button size="sm" className="w-full text-xs" variant="outline" onClick={() => setLeaveQueue([])}>
              Approve All Pending Requests
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Lower Section: AI Insights & Department Metrics */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Department Breakdown Donut */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Department Headcount</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">Distribution across 1,240 employees.</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights & Risk Alerts */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-8 glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle className="text-lg font-bold text-foreground">Kenzo AI Intelligence & Predictive Insights</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground text-xs">Automated workforce risk detection and operational alerts.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-500" /> High Attrition Risk Alert
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-200/80">5 senior engineering employees identified with high attrition markers in Q3.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Clock className="h-4 w-4 text-amber-500" /> Overtime Anomaly Detected
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-200/80">12 design team members exceeded 40 hours overtime threshold this pay cycle.</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 text-blue-500" /> Probation Period Expirations
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-200/80">8 new hires probation period ending in next 14 days. Appraisal review ready.</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Payroll Readiness 99.8%
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-200/80">All attendance and tax calculations synchronized for 1-click August disbursement.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Check,
  FileText,
  CalendarDays,
  Award,
  ArrowRight,
  Trash2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAuth } from "@/lib/auth"
import { getStoredEmployees, EmployeeRecord } from "@/lib/employee-store"
import { getStoredLeaves, updateLeaveStatus, addLeaveRequest, deleteLeaveRequest, LeaveRequestRecord } from "@/lib/leave-store"
import { getStoredPayslips, PayslipRecord } from "@/lib/payslip-store"
import { getNotificationsForUser, markNotificationAsRead, addTargetNotification, UserNotification } from "@/lib/notification-store"

import {
  attendanceData,
} from "@/features/dashboard/data"

const COLORS = ["#3B82F6", "#6366F1", "#EC4899", "#8B5CF6", "#10B981", "#F59E0B", "#06B6D4"]

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()

  // Real-Time Live Clock (Ticks every 1 second)
  const [liveTime, setLiveTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      setLiveTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])
  const [employees] = useState<EmployeeRecord[]>(() => getStoredEmployees())
  const [leaves, setLeaves] = useState<LeaveRequestRecord[]>(() => getStoredLeaves())
  const [payslips] = useState<PayslipRecord[]>(() => getStoredPayslips())
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([])

  // Calculate dynamic department headcount from live stored employees
  const dynamicDepartmentData = useMemo(() => {
    const counts: Record<string, number> = {}
    employees.forEach(emp => {
      const d = emp.dept || "General"
      counts[d] = (counts[d] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [employees])

  // Employee Attendance Clock In/Out State
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)

  // Employee Apply Leave Form State
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [leaveType, setLeaveType] = useState("Casual Leave")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  // Appraisal Request Form State
  const [isAppraisalOpen, setIsAppraisalOpen] = useState(false)
  const [appraisalTitle, setAppraisalTitle] = useState("")
  const [appraisalNotes, setAppraisalNotes] = useState("")
  const [appraisalSubmitted, setAppraisalSubmitted] = useState(false)

  const pendingLeaves = leaves.filter(l => l.status === "Pending")
  const activeEmployees = employees.filter(e => e.status === "Active")
  const myLeavesList = leaves.filter(l => l.employeeEmail.toLowerCase() === user?.email?.toLowerCase())
  const myPayslipsList = payslips.filter(p => p.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  // Employee notifications
  const employeeUnreadNotifs: UserNotification[] = (user?.email
    ? getNotificationsForUser(user.email).filter(n => !n.isRead && !dismissedNotifIds.includes(n.id))
    : [])

  const handleApprove = (id: string) => {
    const target = leaves.find(l => l.id === id)
    const updated = updateLeaveStatus(id, "Approved")
    setLeaves(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "🎉 Leave Application Approved!",
        message: `Your ${target.leaveType} application (${target.startDate} to ${target.endDate}) has been APPROVED by Admin.`,
        type: "LEAVE",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleReject = (id: string) => {
    const target = leaves.find(l => l.id === id)
    const updated = updateLeaveStatus(id, "Rejected")
    setLeaves(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "❌ Leave Application Update",
        message: `Your ${target.leaveType} application (${target.startDate} to ${target.endDate}) was rejected by Admin.`,
        type: "LEAVE",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleDeleteLeave = (id: string) => {
    const updated = deleteLeaveRequest(id)
    setLeaves(updated)
  }

  const handleApproveAll = () => {
    let updated = leaves
    pendingLeaves.forEach(l => {
      updated = updateLeaveStatus(l.id, "Approved")
    })
    setLeaves(updated)
  }

  const handleClockToggle = () => {
    if (!isCheckedIn) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setIsCheckedIn(true)
      setCheckInTime(now)
    } else {
      setIsCheckedIn(false)
    }
  }

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    const newReq: LeaveRequestRecord = {
      id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: user?.name || "Sujal Kumar",
      employeeEmail: user?.email || "employee@kenzo.com",
      leaveType,
      days: 1,
      startDate,
      endDate,
      reason: reason || "Personal leave request",
      status: "Pending",
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }

    const updated = addLeaveRequest(newReq)
    setLeaves(updated)
    setIsApplyOpen(false)
    setReason("")
  }

  const handleAppraisalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAppraisalSubmitted(true)
    setTimeout(() => {
      setIsAppraisalOpen(false)
      setAppraisalSubmitted(false)
    }, 1500)
  }

  const dynamicStatCards = [
    { title: "TOTAL EMPLOYEES", value: `${employees.length}`, change: "Active workforce" },
    { title: "PRESENT TODAY", value: `${activeEmployees.length}`, change: "100% attendance" },
    { title: "ON LEAVE", value: `${employees.length - activeEmployees.length}`, change: "All present" },
    { title: "PENDING REQUESTS", value: `${pendingLeaves.length}`, change: pendingLeaves.length > 0 ? "Requires review" : "No pending" },
    { title: "PROJECTS ACTIVE", value: "1", change: "Kenzo HRMS" },
  ]

  // --------------------------------------------------------------------------
  // EMPLOYEE PORTAL VIEW (Non-Admin View)
  // --------------------------------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Live Admin Approval Pop-Up Notification Alert Banner */}
        {employeeUnreadNotifs.length > 0 && (
          <div className="space-y-3">
            {employeeUnreadNotifs.map((notif) => (
              <div key={notif.id} className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/90 via-background to-blue-950/90 p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                      {notif.title}
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">Admin Status Update</Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    markNotificationAsRead(notif.id)
                    setDismissedNotifIds(prev => [...prev, notif.id])
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shrink-0"
                >
                  Acknowledge & Dismiss
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Employee Workspace & Self-Service
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome Back, <span className="hero-gradient-text">{user?.name}</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {user?.designation || "Software Architect"} • {user?.department || "Engineering"} Department
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border text-foreground">
              <Calendar className="mr-2 h-4 w-4 text-blue-500" /> August 2026
            </Button>
          </div>
        </div>

        {/* Top 3 Quick Action Cards for Employee */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Mark Attendance */}
          <Card className="glass-card flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" /> Today&apos;s Attendance
                </CardTitle>
                <Badge className={isCheckedIn ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}>
                  {isCheckedIn ? "Checked In" : "Not Checked In"}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                {isCheckedIn ? `Punched in at ${checkInTime} AM` : "Mark your current day attendance."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleClockToggle}
                className={`w-full font-bold shadow-md ${isCheckedIn ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
              >
                {isCheckedIn ? `Clock Out (${liveTime || "Live"})` : `Clock In (${liveTime || "Live"})`}
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Leave Application */}
          <Card className="glass-card flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-500" /> Leave Application
                </CardTitle>
                <Badge variant="outline">12 Days Remaining</Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Submit time-off requests and track approval status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Submit Leave Application
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                    <DialogDescription>Submit your time-off request for HR and manager approval.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleApplyLeave} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <Label>Leave Type</Label>
                      <Select value={leaveType} onValueChange={setLeaveType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Leave Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                          <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                          <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Start Date</Label>
                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                      </div>
                      <div className="space-y-1">
                        <Label>End Date</Label>
                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Reason for Leave</Label>
                      <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Personal family work..." required />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
                      Submit Leave Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Card 3: Appraisal Request */}
          <Card className="glass-card flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" /> Appraisals & Requests
                </CardTitle>
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Rating: 95/100</Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Request performance appraisal or manager feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isAppraisalOpen} onOpenChange={setIsAppraisalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full font-semibold border-border text-foreground">
                    Submit Appraisal Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Appraisal & Rating Review Request</DialogTitle>
                    <DialogDescription>Submit your accomplishments and performance goals for evaluation.</DialogDescription>
                  </DialogHeader>
                  {appraisalSubmitted ? (
                    <div className="text-center py-6 text-emerald-600 dark:text-emerald-400 font-bold flex flex-col items-center gap-2">
                      <Check className="h-10 w-10 text-emerald-500" />
                      Appraisal Request Submitted Successfully!
                    </div>
                  ) : (
                    <form onSubmit={handleAppraisalSubmit} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <Label>Review Period / Goal Title</Label>
                        <Input value={appraisalTitle} onChange={e => setAppraisalTitle(e.target.value)} placeholder="e.g. Q3 2026 Performance & Compensation Review" required />
                      </div>
                      <div className="space-y-1">
                        <Label>Accomplishments & Key Projects</Label>
                        <Input value={appraisalNotes} onChange={e => setAppraisalNotes(e.target.value)} placeholder="Summary of key deliverables achieved..." required />
                      </div>
                      <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
                        Submit for Management Review
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Lower Grid: My Recent Leave Requests & My Payslips */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* My Leaves List */}
          <Card className="col-span-12 lg:col-span-7 glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-500" /> My Leave Requests History
              </CardTitle>
              <CardDescription className="text-xs">Real-time status of your time-off applications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myLeavesList.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No leave applications submitted yet.</div>
              ) : (
                myLeavesList.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <div className="text-xs font-bold text-foreground">{req.leaveType}</div>
                      <div className="text-[11px] text-muted-foreground">{req.startDate} to {req.endDate} • {req.reason}</div>
                    </div>
                    <Badge className={req.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : req.status === "Pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"}>
                      {req.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* My Payslips Quick Access */}
          <Card className="col-span-12 lg:col-span-5 glass-card flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" /> My Issued Payslips
              </CardTitle>
              <CardDescription className="text-xs">Download or print your monthly salary statements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myPayslipsList.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No payslips issued for your account yet.</div>
              ) : (
                myPayslipsList.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <div className="text-xs font-bold text-foreground">{p.month} Salary</div>
                      <div className="text-[11px] text-muted-foreground">Net Pay: {p.net}</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Issued</Badge>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button asChild variant="outline" className="w-full text-xs text-foreground">
                <a href="/payroll">
                  View All Payslips <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // EXECUTIVE ADMIN CONTROL CENTER (Admin View)
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Kenzo HRMS Executive Control Center
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Good Morning, <span className="hero-gradient-text">{user?.name?.split(' ')[0] || "User"}</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Here is real-time intelligence for Kenzo Technologies workforce.</p>
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

      {/* 5 Dynamic Stat Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {dynamicStatCards.map((card, i) => (
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
                  <TrendingUp className="h-3 w-3" /> ~ {card.change}
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
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Area type="monotone" dataKey="present" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Persistent Leave Requests Queue with Admin Actions */}
        <Card className="col-span-12 lg:col-span-5 glass-card flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Pending Approvals</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Admin review and leave approval queue.</CardDescription>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">{pendingLeaves.length} Pending</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                All pending approval requests processed!
              </div>
            ) : (
              pendingLeaves.slice(0, 4).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">{req.employeeName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{req.employeeName}</h4>
                      <p className="text-[11px] text-muted-foreground">{req.leaveType} • {req.days} Day</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="default" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-primary-foreground px-2.5" onClick={() => handleApprove(req.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-[11px] text-rose-600 border-rose-200 dark:border-rose-800 hover:bg-rose-50 px-2" onClick={() => handleReject(req.id)}>
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Leave Request" onClick={() => handleDeleteLeave(req.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
          {isAdmin && pendingLeaves.length > 0 && (
            <CardFooter className="border-t pt-3">
              <Button size="sm" className="w-full text-xs text-foreground" variant="outline" onClick={handleApproveAll}>
                Approve All Pending Requests
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Lower Section: AI Insights & Department Metrics */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Department Breakdown Donut */}
        <Card className="col-span-12 md:col-span-6 lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Department Headcount</CardTitle>
            <CardDescription className="text-muted-foreground text-xs">Distribution across {employees.length} active employees.</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dynamicDepartmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {dynamicDepartmentData.map((entry, index) => (
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
              <p className="text-xs text-rose-600 dark:text-rose-200/80">System health monitoring active.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Clock className="h-4 w-4 text-amber-500" /> Overtime Anomaly Detected
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-200/80">No overtime anomalies detected.</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 text-blue-500" /> Probation Period Expirations
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-200/80">All probation reviews completed.</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Payroll Readiness 100%
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-200/80">Master payroll registry synchronized.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

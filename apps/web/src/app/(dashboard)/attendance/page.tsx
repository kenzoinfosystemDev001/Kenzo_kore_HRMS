"use client"

import React, { useState, useEffect } from "react"
import { Clock, CheckCircle2, AlertCircle, XCircle, Download, UserCheck, ShieldAlert, Sparkles, FileText, Calendar as CalendarIcon, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import {
  getStoredAttendanceByDate,
  clockInEmployee,
  clockOutEmployee,
  regularizeAttendance,
  AttendanceRecord,
  AttendanceStatus,
} from "@/lib/attendance-store"

export default function AttendancePage() {
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
  
  const todayStr = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  
  const isToday = selectedDate === todayStr

  // Load records dynamically for the selected calendar date
  const records: AttendanceRecord[] = getStoredAttendanceByDate(selectedDate)

  // Attendance Isolation: Admins view company-wide roster, regular employees view ONLY their own attendance log
  const visibleRecords = isAdmin
    ? records
    : records.filter(r => r.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDept, setSelectedDept] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Regularize Dialog State
  const [isRegOpen, setIsRegOpen] = useState(false)
  const [regEmpEmail, setRegEmpEmail] = useState("")
  const [regCheckIn, setRegCheckIn] = useState("09:00 AM")
  const [regCheckOut, setRegCheckOut] = useState("06:00 PM")
  const [regReason, setRegReason] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Find logged-in employee record for selected date
  const myRecord = records.find(r => r.employeeEmail.toLowerCase() === user?.email?.toLowerCase())
  const isMyClockedIn = !!(myRecord && myRecord.checkIn && !myRecord.checkOut)

  // Recalculate stats dynamically for visible records
  const countPresent = visibleRecords.filter(r => r.status === "Present").length
  const countLate = visibleRecords.filter(r => r.status === "Late").length
  const countHalfDay = visibleRecords.filter(r => r.status === "Half Day").length
  const countAbsent = visibleRecords.filter(r => r.status === "Absent").length
  const totalEmployees = visibleRecords.length

  const handleToggleClock = () => {
    if (!user?.email) return
    
    // Strict restriction: Only allow clocking in/out on the current day!
    if (!isToday) {
      setErrorMsg("Attendance can ONLY be marked on the current day. Switch calendar view to Today.")
      return
    }

    try {
      if (isMyClockedIn) {
        clockOutEmployee(user.email, selectedDate)
      } else {
        clockInEmployee(user.email, selectedDate)
      }
      setErrorMsg(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      }
    }
  }

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regEmpEmail || !regCheckIn || !regCheckOut) return
    regularizeAttendance({ employeeEmail: regEmpEmail, checkIn: regCheckIn, checkOut: regCheckOut, notes: regReason || "Official Field Work" })
    setIsRegOpen(false)
    setRegReason("")
  }

  // Filtered List over visible isolated records
  const filteredRecords = visibleRecords.filter(r => {
    const deptStr = r.department || ""
    const matchesSearch = 
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deptStr.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDept = selectedDept === "all" || deptStr.toLowerCase().includes(selectedDept.toLowerCase())
    const matchesStatus = selectedStatus === "all" || r.status === selectedStatus

    return matchesSearch && matchesDept && matchesStatus
  })

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">Present</Badge>
      case "Late":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">Late (After 10:30 AM)</Badge>
      case "Half Day":
        return <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 font-bold">Half Day (After 12:30 PM)</Badge>
      case "On Leave":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold">On Leave</Badge>
      case "Absent":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold">Absent (Not Clocked In)</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Clock className="h-3.5 w-3.5" /> Corporate Time & Attendance Tracking
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Attendance <span className="hero-gradient-text">Management</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Calendar date inspection & strict current-day clock-in enforcement</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Calendar Date Selector */}
          <div className="flex items-center gap-2 bg-card border rounded-xl p-1.5 shadow-sm">
            <CalendarIcon className="h-4 w-4 text-primary ml-2" />
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={e => {
                setSelectedDate(e.target.value)
                setErrorMsg(null)
              }}
              className="h-8 border-none bg-transparent text-xs font-bold text-foreground focus-visible:ring-0" 
            />
            <Button 
              size="sm" 
              variant={isToday ? "default" : "outline"} 
              onClick={() => {
                setSelectedDate(todayStr)
                setErrorMsg(null)
              }}
              className="h-7 text-xs px-2.5 font-bold"
            >
              Today
            </Button>
          </div>

          <Button variant="outline" className="border-border text-foreground hidden md:flex">
            <Download className="mr-2 h-4 w-4 text-blue-500" /> Export Logs
          </Button>

          {/* Clock In / Out Live Action - Restricted strictly to Current Day */}
          <Button 
            onClick={handleToggleClock}
            disabled={!isToday}
            className={
              !isToday 
                ? "bg-muted text-muted-foreground cursor-not-allowed border opacity-80" 
                : isMyClockedIn 
                  ? "bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            }
          >
            {!isToday ? (
              <>
                <Lock className="mr-2 h-4 w-4 text-amber-500" /> Clock-In Restricted (Current Day Only)
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin-slow" /> 
                {isMyClockedIn ? `Clock Out (${liveTime || "Live"})` : `Clock In (${liveTime || "Live"})`}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Date Status Banner & Warning */}
      <div className="flex items-center justify-between bg-card border rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge className={isToday ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 px-3 py-1 font-bold"}>
            {isToday ? "🟢 Current Day (Live Marking Active)" : `🔒 Archive Date Selected: ${selectedDate} (Read-Only Archive)`}
          </Badge>
          {!isToday && (
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Viewing historical attendance for {selectedDate}. Clock-in is disabled.
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-lg">
            <ShieldAlert className="h-4 w-4" /> {errorMsg}
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{countPresent}</div>
            <p className="text-[11px] text-muted-foreground mt-1">On-time arrivals (&le;10:30 AM)</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Late Arrivals</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{countLate}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Arrivals 10:31 AM - 12:30 PM</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Half Day</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{countHalfDay}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Clocked in AFTER 12:30 PM</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{countAbsent}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Not clocked in for {selectedDate}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Roster</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{totalEmployees}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Active workforce on {selectedDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster & Analytics */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Left 3 Columns: Attendance Table */}
        <Card className="col-span-1 lg:col-span-3 glass-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Attendance Logs ({selectedDate})</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">Real-time check-in records for all {totalEmployees} active employees.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input 
                  placeholder="Search employee..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="max-w-[200px] text-foreground bg-background" 
                />
                <Select value={selectedDept} onValueChange={setSelectedDept}>
                  <SelectTrigger className="w-[140px] text-foreground bg-background">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Depts</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px] text-foreground bg-background">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Late">Late</SelectItem>
                    <SelectItem value="Half Day">Half Day</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Department</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Check In</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Check Out</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Total Hours</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Attendance Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No matching attendance records found for {selectedDate}.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/40 border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-primary/20">
                            <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${record.employeeName}`} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {record.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground text-sm">{record.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{record.employeeEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{record.department}</TableCell>
                      <TableCell className="font-mono text-xs text-foreground font-semibold">
                        {record.checkIn || <span className="text-muted-foreground font-normal">--:--</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground font-semibold">
                        {record.checkOut || <span className="text-muted-foreground font-normal">--:--</span>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {record.totalHours || "--"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(record.status)}
                          {record.notes && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                              {record.notes}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right 1 Column: Mini Calendar & Executive Analytics Panel */}
        <Card className="col-span-1 glass-card flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" /> Date & Calendar Inspector
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Select date to inspect logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interactive Calendar Quick Selector */}
            <div className="rounded-xl border border-primary/20 bg-card p-3 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-primary" /> {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                {isToday ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Today</Badge>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setSelectedDate(todayStr)} className="h-5 text-[10px] px-1.5 text-blue-500">Go to Today</Button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-muted-foreground">Inspect Calendar Date:</Label>
                <Input 
                  type="date" 
                  value={selectedDate} 
                  onChange={e => {
                    setSelectedDate(e.target.value)
                    setErrorMsg(null)
                  }}
                  className="w-full text-xs font-mono font-bold bg-background text-foreground" 
                />
              </div>
            </div>

            {/* Compliance Bar */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Attendance Rate ({selectedDate})</div>
              <div className="text-3xl font-black text-foreground mt-1">
                {totalEmployees > 0 ? Math.round(((countPresent + countLate + countHalfDay) / totalEmployees) * 100) : 0}%
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {countPresent + countLate + countHalfDay} of {totalEmployees} active on {selectedDate}
              </p>
            </div>

            {/* Strict Policy Box */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" /> Attendance Policy & Rules
              </h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span><strong>Current Day Only</strong>: Clock-in restricted to today</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span><strong>10:31 AM - 12:30 PM</strong>: Marked Late</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span><strong>After 12:30 PM</strong>: Automatically Half Day</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span><strong>Unmarked</strong>: Marked Absent</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions & Regularization */}
            <div className="space-y-2 pt-2 border-t border-border">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Management Actions</h4>
              
              <Dialog open={isRegOpen} onOpenChange={setIsRegOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-xs font-semibold">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" /> Regularize Attendance ({selectedDate})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Regularize Attendance for {selectedDate}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">Adjust or approve attendance for field work or missed clock-ins.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegularizeSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <Label>Select Employee</Label>
                      <Select value={regEmpEmail} onValueChange={setRegEmpEmail} required>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Employee..." />
                        </SelectTrigger>
                        <SelectContent>
                          {records.map(r => (
                            <SelectItem key={r.id} value={r.employeeEmail}>{r.employeeName} ({r.department})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Check In Time</Label>
                        <Input value={regCheckIn} onChange={e => setRegCheckIn(e.target.value)} placeholder="09:00 AM" required />
                      </div>
                      <div className="space-y-1">
                        <Label>Check Out Time</Label>
                        <Input value={regCheckOut} onChange={e => setRegCheckOut(e.target.value)} placeholder="06:00 PM" required />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Reason / Note</Label>
                      <Input value={regReason} onChange={e => setRegReason(e.target.value)} placeholder="Official Client Visit / Field Duty" required />
                    </div>

                    <Button type="submit" className="w-full font-bold">Approve Regularization for {selectedDate}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

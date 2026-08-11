"use client"

import React, { useState } from "react"
import { CalendarDays, Plus, Check, X, Calendar as CalendarIcon, Clock, Briefcase, Settings2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAuth } from "@/lib/auth"
import { getStoredLeaves, updateLeaveStatus, addLeaveRequest, deleteLeaveRequest, LeaveRequestRecord } from "@/lib/leave-store"
import { addTargetNotification } from "@/lib/notification-store"
import { leaveBalances, leaveTypes } from "@/features/leave/data"

export default function LeaveManagementPage() {
  const { user, isAdmin } = useAuth()
  const [leaves, setLeaves] = useState<LeaveRequestRecord[]>(() => getStoredLeaves())
  const [isApplyOpen, setIsApplyOpen] = useState(false)

  // Apply Leave Form State
  const [leaveType, setLeaveType] = useState("Casual Leave")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  const handleApprove = async (id: string) => {
    const target = leaves.find(l => l.id === id)
    const updated = await updateLeaveStatus(id, "Approved")
    setLeaves(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "🎉 Leave Application Approved!",
        message: `Your ${target.leaveType || target.type} application (${target.startDate} to ${target.endDate}) has been APPROVED by Admin.`,
        type: "LEAVE",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleReject = async (id: string) => {
    const target = leaves.find(l => l.id === id)
    const updated = await updateLeaveStatus(id, "Rejected")
    setLeaves(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "❌ Leave Application Update",
        message: `Your ${target.leaveType || target.type} application (${target.startDate} to ${target.endDate}) was rejected by Admin.`,
        type: "LEAVE",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleDelete = async (id: string) => {
    const updated = await deleteLeaveRequest(id)
    setLeaves(updated)
  }

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return

    const newReq: LeaveRequestRecord = {
      id: `LV-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: user?.name || "Employee",
      employeeEmail: user?.email || "employee@kenzo.com",
      type: leaveType,
      leaveType,
      days: 1,
      startDate,
      endDate,
      reason: reason || "Personal leave request",
      status: "Pending",
      appliedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }

    const updated = await addLeaveRequest(newReq)
    setLeaves(updated)
    setIsApplyOpen(false)
    setReason("")
  }

  // Isolation: Filter personal leaves for regular employees
  const myLeavesList = leaves.filter(l => !user?.email || l.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">Approved</Badge>
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold">Rejected</Badge>
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
            <CalendarDays className="h-3.5 w-3.5" /> Corporate Leave Management
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Leave <span className="hero-gradient-text">Management</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Submit time-off requests, track balances, and inspect approvals.</p>
        </div>

        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Apply Leave
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
                    <SelectItem value="Maternity / Paternity">Maternity / Paternity</SelectItem>
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
                <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Family function / Personal work..." required />
              </div>

              <Button type="submit" className="w-full bg-primary font-bold">
                Submit Leave Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue={isAdmin ? "requests" : "myleaves"} className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          {isAdmin && (
            <TabsTrigger value="requests" className="font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Company Master Requests ({leaves.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="myleaves" className="font-bold flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-500" />
            My Personal Leaves ({myLeavesList.length})
          </TabsTrigger>
          <TabsTrigger value="balances" className="font-bold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            Leave Balances
          </TabsTrigger>
          <TabsTrigger value="types" className="font-bold flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-amber-500" />
            Leave Types
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Admin Master Requests */}
        {isAdmin && (
          <TabsContent value="requests" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Company-Wide Leave Requests</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Review, approve, or delete employee leave applications across departments.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto p-2 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Type</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Dates</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Days</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Reason</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right font-bold text-muted-foreground">Admin Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                {request.employeeName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-foreground text-xs">{request.employeeName}</div>
                              <div className="text-[11px] text-muted-foreground">{request.appliedDate}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{request.leaveType}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{request.startDate} to {request.endDate}</TableCell>
                        <TableCell className="text-xs font-bold text-foreground">{request.days} day(s)</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate text-muted-foreground">{request.reason}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {request.status === "Pending" && (
                              <>
                                <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(request.id)}>
                                  <Check className="h-3.5 w-3.5 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 border-rose-200 dark:border-rose-800" onClick={() => handleReject(request.id)}>
                                  <X className="h-3.5 w-3.5 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Leave Request" onClick={() => handleDelete(request.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab 2: My Personal Leaves */}
        <TabsContent value="myleaves" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">My Personal Leave Applications</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Confidential history of your submitted time-off requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {myLeavesList.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No leave applications submitted yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold text-muted-foreground">Request ID</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Type</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Dates</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Reason</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myLeavesList.map((leave) => (
                      <TableRow key={leave.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{leave.id}</TableCell>
                        <TableCell className="font-bold text-foreground text-xs">{leave.leaveType}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{leave.startDate} to {leave.endDate}</TableCell>
                        <TableCell className="text-xs max-w-[250px] truncate text-muted-foreground">{leave.reason}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Leave Balances */}
        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {leaveBalances.map((balance) => (
              <Card key={balance.id} className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{balance.type}</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-foreground">{balance.available} <span className="text-xs font-normal text-muted-foreground">/ {balance.allocated} days</span></div>
                  <Progress value={(balance.available / balance.allocated) * 100} className="mt-3 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{balance.used} days used this year</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Leave Types */}
        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaveTypes.map((type) => (
              <Card key={type.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-foreground">{type.name}</CardTitle>
                    <Badge variant="outline" className="font-bold">{type.days} days/yr</Badge>
                  </div>
                  <CardDescription className="mt-1.5 text-xs text-muted-foreground">Code: {type.code} • Accrual: {type.accrual}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                  <div>• Paid Leave: {type.isPaid ? "Yes" : "No"}</div>
                  <div>• Requires Manager Approval: Yes</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

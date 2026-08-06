"use client"

import React, { useState } from "react"
import { CalendarDays, Plus, Check, X, Calendar as CalendarIcon, Clock, Briefcase, Settings2 } from "lucide-react"

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
import { getStoredLeaves, updateLeaveStatus, addLeaveRequest, LeaveRequestRecord } from "@/lib/leave-store"
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

  const handleApprove = (id: string) => {
    const updated = updateLeaveStatus(id, "Approved")
    setLeaves(updated)
  }

  const handleReject = (id: string) => {
    const updated = updateLeaveStatus(id, "Rejected")
    setLeaves(updated)
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

  const myLeavesList = leaves.filter(l => l.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200">Approved</Badge>
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Submit leave applications, track balances, and process team approvals.</p>
        </div>

        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
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

              <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
                Submit Leave Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            All Leave Requests ({leaves.length})
          </TabsTrigger>
          <TabsTrigger value="myleaves" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            My Leaves ({myLeavesList.length})
          </TabsTrigger>
          <TabsTrigger value="balances" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Leave Balances
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Leave Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Team Leave Requests</CardTitle>
              <CardDescription>Review and manage employee leave applications across departments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((request) => (
                    <TableRow key={request.id}>
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
                      <TableCell className="text-xs">{request.leaveType}</TableCell>
                      <TableCell className="text-xs">{request.startDate} to {request.endDate}</TableCell>
                      <TableCell className="text-xs font-semibold">{request.days} day(s)</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          {request.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="outline" className="h-7 text-emerald-600 border-emerald-300 hover:bg-emerald-50 text-[11px]" onClick={() => handleApprove(request.id)}>
                                <Check className="h-3.5 w-3.5 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-rose-600 border-rose-300 hover:bg-rose-50 text-[11px]" onClick={() => handleReject(request.id)}>
                                <X className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">Processed</span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="myleaves" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>My Leave Applications</CardTitle>
              <CardDescription>History of your submitted time-off requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeavesList.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{leave.id}</TableCell>
                      <TableCell className="font-medium text-xs">{leave.leaveType}</TableCell>
                      <TableCell className="text-xs">{leave.startDate} to {leave.endDate}</TableCell>
                      <TableCell className="text-xs max-w-[250px] truncate">{leave.reason}</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {leaveBalances.map((balance) => (
              <Card key={balance.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{balance.type}</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{balance.available} <span className="text-xs font-normal text-muted-foreground">/ {balance.allocated} days</span></div>
                  <Progress value={(balance.available / balance.allocated) * 100} className="mt-3 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{balance.used} days used this year</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaveTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{type.name}</CardTitle>
                    <Badge variant="outline">{type.days} days/yr</Badge>
                  </div>
                  <CardDescription className="mt-1.5">Code: {type.code} • Accrual: {type.accrual}</CardDescription>
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

"use client"

import React, { useState } from "react"
import { Clock, CheckCircle2, AlertCircle, XCircle, CalendarOff, Calendar as CalendarIcon, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { attendanceData, attendanceStats } from "@/features/attendance/data"

export default function AttendancePage() {
  const [isClockedIn, setIsClockedIn] = useState(true)
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200">Present</Badge>
      case "Late":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">Late</Badge>
      case "On Leave":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200">On Leave</Badge>
      case "Absent":
        return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200">Absent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button 
            onClick={() => setIsClockedIn(!isClockedIn)}
            className={isClockedIn ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
          >
            <Clock className="mr-2 h-4 w-4" /> 
            {isClockedIn ? "Clock Out" : "Clock In"}
          </Button>
        </div>
      </div>

      {/* Top Section Widget */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTime}</div>
            <p className="text-sm font-medium text-primary mt-1">
              {isClockedIn ? "Active - Clocked In" : "Inactive - Clocked Out"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.late}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <CalendarOff className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.onLeave}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.avgHours}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>View and manage employee attendance records.</CardDescription>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Input placeholder="Search employee..." className="pl-8" />
                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="prod">Product</SelectItem>
                  <SelectItem value="des">Design</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Today</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {record.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{record.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Side Panel: Calendar Heatmap placeholder */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Current month trends</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-md border p-4 text-center text-sm text-muted-foreground flex flex-col items-center justify-center h-48 bg-slate-50 dark:bg-slate-900/50">
              <CalendarIcon className="h-8 w-8 mb-2 opacity-20" />
              Calendar heatmap visualization
              <br/>(Integration pending)
            </div>
            
            <div className="space-y-4 mt-2">
              <h4 className="text-sm font-semibold">Quick Actions</h4>
              <Button variant="outline" className="w-full justify-start">Regularize Attendance</Button>
              <Button variant="outline" className="w-full justify-start">View Shift Roster</Button>
              <Button variant="outline" className="w-full justify-start">Overtime Requests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import React from "react"
import { Briefcase, UserPlus, CheckSquare, Clock, Laptop, ShieldCheck, FileCheck, Users, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const newHires = [
  { name: "Ralph Edwards", role: "UI/UX Designer", dept: "Design", joinDate: "May 20, 2026", progress: 80, buddy: "Esther Howard", status: "In Progress" },
  { name: "Cody Fisher", role: "Backend Developer", dept: "Engineering", joinDate: "May 17, 2026", progress: 100, buddy: "Wade Warren", status: "Completed" },
  { name: "Wade Warren", role: "DevOps Engineer", dept: "Engineering", joinDate: "May 15, 2026", progress: 60, buddy: "Jane Cooper", status: "In Progress" },
  { name: "Jane Cooper", role: "HR Executive", dept: "Human Resources", joinDate: "May 12, 2026", progress: 40, buddy: "Kristin Watson", status: "Pending IT" },
]

export default function OnboardingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Onboarding & Offboarding</h2>
          <p className="text-muted-foreground mt-1">Manage new hire welcome checklists, document sign-offs, and IT provisioning.</p>
        </div>
        <Button className="bg-primary">
          <UserPlus className="mr-2 h-4 w-4" /> Start Onboarding
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active New Hires</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklist Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending IT Assets</CardTitle>
            <Laptop className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Devices</div>
            <p className="text-xs text-muted-foreground mt-1">MacBooks assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doc Signatures</CardTitle>
            <FileCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 14</div>
            <p className="text-xs text-muted-foreground mt-1">Contracts signed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Pipeline</CardTitle>
          <CardDescription>Track new team members through setup and orientation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Onboarding Buddy</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newHires.map((hire, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{hire.name}</TableCell>
                  <TableCell>{hire.role} • <span className="text-muted-foreground">{hire.dept}</span></TableCell>
                  <TableCell>{hire.joinDate}</TableCell>
                  <TableCell>{hire.buddy}</TableCell>
                  <TableCell className="w-48">
                    <div className="flex items-center gap-2">
                      <Progress value={hire.progress} className="h-2 flex-1" />
                      <span className="text-xs font-semibold">{hire.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={hire.status === "Completed" ? "default" : "secondary"}>
                      {hire.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Checklist <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

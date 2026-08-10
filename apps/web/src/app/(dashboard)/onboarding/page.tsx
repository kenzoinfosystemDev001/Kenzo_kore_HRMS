"use client"

import React, { useState } from "react"
import { UserPlus, CheckSquare, Laptop, FileCheck, Users, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { getStoredEmployees, EmployeeRecord } from "@/lib/employee-store"
import {
  getStoredOnboardings,
  addOnboardingPipeline,
  updateOnboardingProgress,
  NewHireRecord,
} from "@/lib/onboarding-store"

export default function OnboardingPage() {
  useAuth()
  const [employees] = useState<EmployeeRecord[]>(() => getStoredEmployees())
  const [onboardings, setOnboardings] = useState<NewHireRecord[]>(() => getStoredOnboardings())

  // Start Onboarding Modal State
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [targetEmpEmail, setTargetEmpEmail] = useState("")
  const [buddyName, setBuddyName] = useState("Sujal Kumar")
  const [itAssetsInput, setItAssetsInput] = useState("MacBook Pro M3 + Dual 4K Monitors")
  const [joinDateInput, setJoinDateInput] = useState("")

  const handleStartOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = employees.find(e => e.email === targetEmpEmail) || employees[0]
    if (!emp) return

    const newPipeline: NewHireRecord = {
      id: `ONB-${Math.floor(100 + Math.random() * 900)}`,
      name: emp.name,
      email: emp.email,
      role: emp.role || "Software Engineer",
      dept: emp.dept || "Engineering",
      joinDate: joinDateInput || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      progress: 25,
      buddy: buddyName,
      status: "In Progress",
      itAssetsAssigned: itAssetsInput,
      docSignatures: "2 / 4 Signed",
    }

    const updated = addOnboardingPipeline(newPipeline)
    setOnboardings(updated)
    setIsStartOpen(false)
  }

  const handleProgressIncrement = (id: string, currentProg: number) => {
    const next = Math.min(100, currentProg + 25)
    const newStatus = next === 100 ? "Completed" : "In Progress"
    const updated = updateOnboardingProgress(id, next, newStatus)
    setOnboardings(updated)
  }

  const activeNewHiresCount = onboardings.filter(o => o.status === "In Progress").length
  const avgChecklistProgress = onboardings.length > 0 ? Math.round(onboardings.reduce((acc, o) => acc + o.progress, 0) / onboardings.length) : 0

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <UserPlus className="h-3.5 w-3.5 text-blue-500" /> Talent Onboarding & Offboarding Pipelines
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Onboarding & <span className="hero-gradient-text">Offboarding</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage new hire welcome checklists, document sign-offs, buddy orientation, and IT provisioning.</p>
        </div>

        {/* Start Onboarding Button & Modal */}
        <Dialog open={isStartOpen} onOpenChange={setIsStartOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
              <UserPlus className="mr-2 h-4 w-4" /> Start Onboarding
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" /> Launch New Hire Onboarding Pipeline
              </DialogTitle>
              <DialogDescription>Initialize welcome checklist, assign IT assets, and pair with onboarding buddy.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleStartOnboardingSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Select Employee</Label>
                <Select value={targetEmpEmail} onValueChange={setTargetEmpEmail} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Employee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(e => (
                      <SelectItem key={e.id} value={e.email}>{e.name} ({e.role} • {e.dept})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Assigned Buddy</Label>
                  <Input value={buddyName} onChange={e => setBuddyName(e.target.value)} placeholder="Senior Mentor Name" required />
                </div>
                <div className="space-y-1">
                  <Label>Joining Date</Label>
                  <Input type="date" value={joinDateInput} onChange={e => setJoinDateInput(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1">
                <Label>IT Assets & Devices Assigned</Label>
                <Input value={itAssetsInput} onChange={e => setItAssetsInput(e.target.value)} placeholder="MacBook Pro / Workstation / Key..." required />
              </div>

              <Button type="submit" className="w-full bg-primary font-bold">Launch Onboarding Pipeline</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active New Hires</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{activeNewHiresCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">In active onboarding pipeline</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Checklist Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{avgChecklistProgress}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Average completion rate</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending IT Assets</CardTitle>
            <Laptop className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{onboardings.length} Devices</div>
            <p className="text-[11px] text-muted-foreground mt-1">Provisioned & assigned</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Doc Signatures</CardTitle>
            <FileCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">100% Signed</div>
            <p className="text-[11px] text-muted-foreground mt-1">NDAs & Employment Contracts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Pipeline Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Active Onboarding Pipelines</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Track new team members through IT setup, orientation, and buddy mentoring.</CardDescription>
        </CardHeader>
        <CardContent>
          {onboardings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No active onboarding pipelines</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;Start Onboarding&quot; to begin new hire orientation.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Role & Department</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Joining Date</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Onboarding Buddy</TableHead>
                  <TableHead className="font-bold text-muted-foreground">IT Hardware & Assets</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Progress</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onboardings.map((hire) => (
                  <TableRow key={hire.id} className="hover:bg-muted/40 border-border">
                    <TableCell>
                      <div className="font-bold text-foreground text-sm">{hire.name}</div>
                      <div className="text-xs text-muted-foreground">{hire.email}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {hire.role} • <span className="text-muted-foreground">{hire.dept}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-semibold">{hire.joinDate}</TableCell>
                    <TableCell className="text-xs font-bold text-blue-600 dark:text-blue-400">{hire.buddy}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{hire.itAssetsAssigned}</TableCell>
                    <TableCell className="w-44">
                      <div className="flex items-center gap-2">
                        <Progress value={hire.progress} className="h-2 flex-1" />
                        <span className="text-xs font-extrabold text-foreground">{hire.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={hire.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold"}>
                        {hire.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {hire.progress < 100 ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs font-bold" onClick={() => handleProgressIncrement(hire.id, hire.progress)}>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" /> Advance Task
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-emerald-600 font-bold">100% Complete</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { TrendingUp, Target, Star, Plus, Sparkles, Award, Check, X, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import {
  getStoredAppraisals,
  addAppraisalRequest,
  updateAppraisalStatus,
  deleteAppraisalRequest,
  getStoredOKRs,
  addOKR,
  AppraisalRequestRecord,
  OKRRecord,
} from "@/lib/performance-store"
import { addTargetNotification } from "@/lib/notification-store"

export default function PerformancePage() {
  const { user, isAdmin } = useAuth()
  const [appraisals, setAppraisals] = useState<AppraisalRequestRecord[]>(() => getStoredAppraisals())
  const [okrs, setOkrs] = useState<OKRRecord[]>(() => getStoredOKRs())

  // Appraisal Request Modal State
  const [isAppraisalOpen, setIsAppraisalOpen] = useState(false)
  const [currentRoleInput, setCurrentRoleInput] = useState(user?.designation || "Software Engineer")
  const [requestedRoleInput, setRequestedRoleInput] = useState("Senior Software Engineer / Lead")
  const [currentSalaryInput, setCurrentSalaryInput] = useState("₹12,00,000")
  const [requestedSalaryInput, setRequestedSalaryInput] = useState("₹16,00,000")
  const [selfRatingInput, setSelfRatingInput] = useState("5")
  const [justificationInput, setJustificationInput] = useState("")

  // OKR Creation Modal State
  const [isOkrOpen, setIsOkrOpen] = useState(false)
  const [okrTitle, setOkrTitle] = useState("")
  const [okrCategory, setOkrCategory] = useState("Engineering")
  const [okrWeight, setOkrWeight] = useState("25%")

  const handleAppraisalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestedRoleInput || !justificationInput) return

    const newReq: AppraisalRequestRecord = {
      id: `APP-2026-${Math.floor(10 + Math.random() * 90)}`,
      employeeName: user?.name || "Employee",
      employeeEmail: user?.email || "employee@kenzo.com",
      department: user?.department || "Engineering",
      currentRole: currentRoleInput,
      requestedRole: requestedRoleInput,
      currentSalary: currentSalaryInput,
      requestedSalary: requestedSalaryInput,
      selfRating: parseInt(selfRatingInput) || 5,
      justification: justificationInput,
      status: "Pending",
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }

    const updated = addAppraisalRequest(newReq)
    setAppraisals(updated)
    setIsAppraisalOpen(false)
    setJustificationInput("")
  }

  const handleOkrSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!okrTitle) return

    const newOkr: OKRRecord = {
      id: `OKR-${Math.floor(200 + Math.random() * 800)}`,
      title: okrTitle,
      category: okrCategory,
      progress: 0,
      weight: okrWeight,
      owner: user?.name || "Team Lead",
      status: "In Progress",
    }

    const updated = addOKR(newOkr)
    setOkrs(updated)
    setIsOkrOpen(false)
    setOkrTitle("")
  }

  const handleApproveAppraisal = (id: string) => {
    const target = appraisals.find(a => a.id === id)
    const updated = updateAppraisalStatus(id, "Approved", "Approved by Executive HR Management.")
    setAppraisals(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "🌟 Appraisal & Promotion Approved!",
        message: `Congratulations! Your appraisal request (${target.id}) to ${target.requestedRole} (${target.requestedSalary}) has been APPROVED by HR Management!`,
        type: "APPRAISAL",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleRejectAppraisal = (id: string) => {
    const target = appraisals.find(a => a.id === id)
    const updated = updateAppraisalStatus(id, "Rejected", "Cycle feedback recorded.")
    setAppraisals(updated)

    if (target) {
      addTargetNotification({
        targetEmail: target.employeeEmail.toLowerCase(),
        title: "📋 Appraisal Request Update",
        message: `Your appraisal request (${target.id}) for ${target.requestedRole} was reviewed by HR Management.`,
        type: "APPRAISAL",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleDeleteAppraisal = (id: string) => {
    const updated = deleteAppraisalRequest(id)
    setAppraisals(updated)
  }

  // Filtered appraisals for regular employees
  const visibleAppraisals = isAdmin
    ? appraisals
    : appraisals.filter(a => a.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  const avgOkrProgress = okrs.length > 0 ? Math.round(okrs.reduce((acc, o) => acc + o.progress, 0) / okrs.length) : 0

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Target className="h-3.5 w-3.5 text-blue-500" /> Enterprise Appraisal & Performance Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Performance & <span className="hero-gradient-text">OKRs</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage quarterly objectives, key results, 360° reviews, and employee appraisal requests.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Employee Request Appraisal CTA */}
          <Dialog open={isAppraisalOpen} onOpenChange={setIsAppraisalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-bold">
                <Award className="mr-2 h-4 w-4" /> Request Appraisal / Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" /> Submit Performance Appraisal Request
                </DialogTitle>
                <DialogDescription>Request a role promotion, compensation review, or performance appraisal.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAppraisalSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Current Role</Label>
                    <Input value={currentRoleInput} onChange={e => setCurrentRoleInput(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Requested Target Role</Label>
                    <Input value={requestedRoleInput} onChange={e => setRequestedRoleInput(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Current Salary (CTC)</Label>
                    <Input value={currentSalaryInput} onChange={e => setCurrentSalaryInput(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Requested Salary (CTC)</Label>
                    <Input value={requestedSalaryInput} onChange={e => setRequestedSalaryInput(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Self-Performance Rating (1 to 5 Stars)</Label>
                  <Select value={selfRatingInput} onValueChange={setSelfRatingInput}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 ★★★★★ (Exceptional / Exceeds Expectations)</SelectItem>
                      <SelectItem value="4">4 ★★★★☆ (Strong Performer)</SelectItem>
                      <SelectItem value="3">3 ★★★☆☆ (Meets Expectations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Key Achievements & Justification</Label>
                  <Input
                    value={justificationInput}
                    onChange={e => setJustificationInput(e.target.value)}
                    placeholder="Summary of projects completed, impact, and targets achieved..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary font-bold">Submit Appraisal Request</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create Goal (OKR) Modal CTA (Admin Only!) */}
          {isAdmin && (
            <Dialog open={isOkrOpen} onOpenChange={setIsOkrOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Create Goal (OKR)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Define Objective & Key Result (OKR)</DialogTitle>
                  <DialogDescription>Create a strategic target for the current quarter.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleOkrSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>Objective Title</Label>
                    <Input value={okrTitle} onChange={e => setOkrTitle(e.target.value)} placeholder="e.g. Optimize platform latency below 100ms" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Select value={okrCategory} onValueChange={setOkrCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Dept" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Weight</Label>
                      <Input value={okrWeight} onChange={e => setOkrWeight(e.target.value)} placeholder="25%" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full font-bold">Create Strategic Goal</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Review Cycle</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">Q3 2026 Appraisal</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Active Cycle in Progress</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall OKR Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{avgOkrProgress}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">Company-wide average completion</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appraisal Requests</CardTitle>
            <Award className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{visibleAppraisals.length} Submitted</div>
            <p className="text-[11px] text-muted-foreground mt-1">{appraisals.filter(a => a.status === "Pending").length} Pending HR review</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">4.9 / 5.0 Rating</div>
            <p className="text-[11px] text-muted-foreground mt-1">Eligible for promotion</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="appraisals" className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          <TabsTrigger value="appraisals" className="font-bold">Appraisal & Promotion Requests</TabsTrigger>
          <TabsTrigger value="okrs" className="font-bold">Company Goals (OKRs)</TabsTrigger>
          <TabsTrigger value="reviews" className="font-bold">360° Performance Reviews</TabsTrigger>
        </TabsList>

        {/* Tab 1: Appraisal Requests */}
        <TabsContent value="appraisals" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Employee Appraisal & Promotion Applications</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Submitted requests for role advancement, appraisal, and salary adjustments.</CardDescription>
            </CardHeader>
            <CardContent>
              {visibleAppraisals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">No appraisal requests submitted yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Click &quot;Request Appraisal / Promotion&quot; to apply for performance review.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold text-muted-foreground">Appraisal ID</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Current vs Target Role</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Current vs Target Salary</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Self Rating</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                      {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Admin Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleAppraisals.map((app) => (
                      <TableRow key={app.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{app.id}</TableCell>
                        <TableCell>
                          <div className="font-bold text-foreground text-sm">{app.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{app.department}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-foreground">{app.currentRole}</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">➔ {app.requestedRole}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-foreground">{app.currentSalary}</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">➔ {app.requestedSalary}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">
                            {app.selfRating} ★★★★★
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={app.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold" : app.status === "Rejected" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {app.status === "Pending" && (
                                <>
                                  <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApproveAppraisal(app.id)}>
                                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 border-rose-200 dark:border-rose-800" onClick={() => handleRejectAppraisal(app.id)}>
                                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Appraisal Request" onClick={() => handleDeleteAppraisal(app.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Company Goals (OKRs) */}
        <TabsContent value="okrs" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Key Strategic Objectives (OKRs)</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Aligned department key results and completion tracking.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-bold text-muted-foreground">OKR Title</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Category</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Owner</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Progress</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {okrs.map((okr) => (
                    <TableRow key={okr.id} className="hover:bg-muted/40 border-border">
                      <TableCell className="font-bold text-foreground text-sm">{okr.title}</TableCell>
                      <TableCell><Badge variant="outline">{okr.category}</Badge></TableCell>
                      <TableCell className="text-xs font-semibold">{okr.owner}</TableCell>
                      <TableCell className="w-48">
                        <div className="flex items-center gap-2">
                          <Progress value={okr.progress} className="h-2 flex-1" />
                          <span className="text-xs font-bold text-foreground">{okr.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={okr.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold"}>
                          {okr.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 360° Performance Reviews */}
        <TabsContent value="reviews" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">360° Executive Peer & Manager Reviews</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Cross-functional feedback ratings and assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h4 className="font-extrabold text-foreground text-sm">Q3 2026 Executive Review Completed</h4>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">4.9 / 5.0 Rating</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  &quot;Exceptional technical execution, multi-tenant security architecture delivery, and prompt resolution of enterprise customer demands.&quot;
                </p>
                <div className="text-[11px] text-muted-foreground font-semibold pt-1 border-t border-border flex justify-between">
                  <span>Reviewer: Executive Management Board</span>
                  <span>Completed: Aug 09, 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

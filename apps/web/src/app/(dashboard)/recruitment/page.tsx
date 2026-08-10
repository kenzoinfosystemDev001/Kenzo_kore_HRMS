"use client"

import React, { useState } from "react"
import { 
  UserPlus, 
  Briefcase, 
  Users, 
  Plus, 
  Calendar, 
  Award,
  Trash2,
  UserCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import {
  getStoredRequisitions,
  addRequisition,
  deleteRequisition,
  getStoredCandidates,
  addCandidate,
  deleteCandidate,
  updateCandidateStage,
  RequisitionRecord,
  CandidateRecord,
} from "@/lib/recruitment-store"

export default function RecruitmentPage() {
  const { isAdmin } = useAuth()
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>(() => getStoredRequisitions())
  const [candidates, setCandidates] = useState<CandidateRecord[]>(() => getStoredCandidates())
  const [searchTerm, setSearchTerm] = useState("")

  // New Requisition Modal State
  const [isAddReqOpen, setIsAddReqOpen] = useState(false)
  const [reqTitle, setReqTitle] = useState("")
  const [reqDept, setReqDept] = useState("Engineering")
  const [reqPositions, setReqPositions] = useState("2 Open")
  const [reqBudget, setReqBudget] = useState("₹20L - ₹30L")

  // New Candidate Modal State
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [candName, setCandName] = useState("")
  const [candRole, setCandRole] = useState("")
  const [candEmail, setCandEmail] = useState("")
  const [candStage, setCandStage] = useState("HR Screening")

  const handleAddReq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqTitle) return

    const newReq: RequisitionRecord = {
      id: `REQ-${Math.floor(200 + Math.random() * 800)}`,
      title: reqTitle,
      dept: reqDept,
      positions: reqPositions,
      applicants: 0,
      status: "Active",
      budget: reqBudget,
    }

    const updated = addRequisition(newReq)
    setRequisitions(updated)
    setReqTitle("")
    setIsAddReqOpen(false)
  }

  const handleDeleteReq = (id: string) => {
    const updated = deleteRequisition(id)
    setRequisitions(updated)
  }

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!candName || !candRole) return

    const newCand: CandidateRecord = {
      id: `CAND-${Math.floor(100 + Math.random() * 900)}`,
      name: candName,
      role: candRole,
      stage: candStage,
      rating: 5,
      email: candEmail || `${candName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      source: "Career Portal",
    }

    const updated = addCandidate(newCand)
    setCandidates(updated)
    setCandName("")
    setCandRole("")
    setCandEmail("")
    setIsAddCandidateOpen(false)
  }

  const handleDeleteCand = (id: string) => {
    const updated = deleteCandidate(id)
    setCandidates(updated)
  }

  const handleStageChange = (id: string, stage: string) => {
    const updated = updateCandidateStage(id, stage)
    setCandidates(updated)
  }

  const filteredRequisitions = requisitions.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.dept.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Offer Extended":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">Offer Extended</Badge>
      case "Technical Interview":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold">Technical Interview</Badge>
      case "HR Screening":
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold">HR Screening</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <UserPlus className="h-3.5 w-3.5" /> Kenzo Talent ATS & Job Requisitions
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Recruitment & <span className="hero-gradient-text">ATS</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage open requisitions, candidate evaluation pipelines, and offer letters.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Create Candidate Button */}
          <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border text-foreground font-bold">
                <UserCheck className="mr-2 h-4 w-4 text-blue-500" /> Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Candidate Application</DialogTitle>
                <DialogDescription>Register candidate details into talent evaluation pipeline.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCandidateSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Candidate Full Name</Label>
                  <Input value={candName} onChange={e => setCandName(e.target.value)} placeholder="e.g. Rahul Sharma" required />
                </div>
                <div className="space-y-1">
                  <Label>Target Position / Role</Label>
                  <Input value={candRole} onChange={e => setCandRole(e.target.value)} placeholder="e.g. Senior Full Stack Engineer" required />
                </div>
                <div className="space-y-1">
                  <Label>Candidate Email</Label>
                  <Input type="email" value={candEmail} onChange={e => setCandEmail(e.target.value)} placeholder="rahul@example.com" />
                </div>
                <div className="space-y-1">
                  <Label>Initial Pipeline Stage</Label>
                  <Select value={candStage} onValueChange={setCandStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR Screening">HR Screening</SelectItem>
                      <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                      <SelectItem value="Management Round">Management Round</SelectItem>
                      <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-primary font-bold">Add Candidate</Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create Job Requisition Button */}
          <Dialog open={isAddReqOpen} onOpenChange={setIsAddReqOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Create Requisition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Job Requisition</DialogTitle>
                <DialogDescription>Open a permanent hiring requirement for team expansion.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddReq} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Job Position Title</Label>
                  <Input value={reqTitle} onChange={e => setReqTitle(e.target.value)} placeholder="e.g. Lead Frontend Architect" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Department</Label>
                    <Select value={reqDept} onValueChange={setReqDept}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Open Headcount</Label>
                    <Input value={reqPositions} onChange={e => setReqPositions(e.target.value)} placeholder="2 Open" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Approved Budget CTC Range</Label>
                  <Input value={reqBudget} onChange={e => setReqBudget(e.target.value)} placeholder="₹20L - ₹30L" required />
                </div>
                <Button type="submit" className="w-full bg-primary font-bold">Save Requisition</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Open Requisitions</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{requisitions.length} Open</div>
            <p className="text-[11px] text-muted-foreground mt-1">Across departments</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Candidates</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{candidates.length} Applicants</div>
            <p className="text-[11px] text-muted-foreground mt-1">In active evaluation</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">4 This Week</div>
            <p className="text-[11px] text-muted-foreground mt-1">Technical & HR rounds</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Offers Extended</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{candidates.filter(c => c.stage === "Offer Extended").length} Pending</div>
            <p className="text-[11px] text-muted-foreground mt-1">Acceptance tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requisitions" className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          <TabsTrigger value="requisitions" className="font-bold">
            Job Requisitions ({requisitions.length})
          </TabsTrigger>
          <TabsTrigger value="candidates" className="font-bold">
            Candidate Pipeline ({candidates.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Job Requisitions */}
        <TabsContent value="requisitions" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Active Job Openings</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Published job listings across company career portals and job boards.</CardDescription>
              </div>
              <Input
                placeholder="Filter requisitions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-xs text-xs"
              />
            </CardHeader>
            <CardContent>
              {filteredRequisitions.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No requisitions found. Click &quot;Create Requisition&quot; to post a new job opening.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold text-muted-foreground">Req ID</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Job Title</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Department</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Open Positions</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Budget Range</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                      {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Admin Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequisitions.map((req) => (
                      <TableRow key={req.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{req.id}</TableCell>
                        <TableCell className="font-bold text-foreground text-sm">{req.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{req.dept}</TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{req.positions}</TableCell>
                        <TableCell className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{req.budget}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">
                            {req.status}
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Requisition" onClick={() => handleDeleteReq(req.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

        {/* Tab 2: Candidate Pipeline */}
        <TabsContent value="candidates" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Candidate Evaluation Roster</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Track candidate progression across interview rounds and offer rollouts.</CardDescription>
              </div>
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-xs text-xs"
              />
            </CardHeader>
            <CardContent>
              {filteredCandidates.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No candidate profiles registered yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold text-muted-foreground">Candidate ID</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Candidate Name</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Applied Position</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Pipeline Stage</TableHead>
                      <TableHead className="font-bold text-muted-foreground">Applied Date</TableHead>
                      {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Admin Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((cand) => (
                      <TableRow key={cand.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{cand.id}</TableCell>
                        <TableCell>
                          <div className="font-bold text-foreground text-sm">{cand.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{cand.email}</div>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{cand.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStageBadge(cand.stage)}
                            {isAdmin && (
                              <Select value={cand.stage} onValueChange={(stage) => handleStageChange(cand.id, stage)}>
                                <SelectTrigger className="h-7 w-28 text-[10px] font-bold">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="HR Screening">HR Screening</SelectItem>
                                  <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                                  <SelectItem value="Management Round">Management Round</SelectItem>
                                  <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{cand.appliedDate}</TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Candidate" onClick={() => handleDeleteCand(cand.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </Tabs>
    </div>
  )
}

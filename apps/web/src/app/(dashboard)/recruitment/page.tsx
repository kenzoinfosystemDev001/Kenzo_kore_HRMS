"use client"

import React, { useState } from "react"
import { 
  UserPlus, 
  Briefcase, 
  Users, 
  Plus, 
  FileText, 
  Calendar, 
  Award,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const initialCandidates = [
  { id: "CND-101", name: "Alex Rivera", role: "Senior Frontend Engineer", stage: "Technical Interview", rating: 4.9, email: "alex.r@example.com", appliedDate: "Aug 01, 2026", source: "LinkedIn" },
  { id: "CND-102", name: "Sophia Chen", role: "Product Designer (UI/UX)", stage: "HR Screening", rating: 4.7, email: "sophia.c@example.com", appliedDate: "Aug 02, 2026", source: "Career Portal" },
  { id: "CND-103", name: "Marcus Vance", role: "DevOps / Infrastructure Lead", stage: "Offer Extended", rating: 5.0, email: "marcus.v@example.com", appliedDate: "Jul 28, 2026", source: "Referral" },
  { id: "CND-104", name: "Elena Rostova", role: "Backend Node.js Architect", stage: "Applied", rating: 4.5, email: "elena.r@example.com", appliedDate: "Aug 04, 2026", source: "Indeed" },
  { id: "CND-105", name: "David Kim", role: "QA Automation Engineer", stage: "Technical Interview", rating: 4.8, email: "david.k@example.com", appliedDate: "Aug 03, 2026", source: "LinkedIn" },
]

const initialRequisitions = [
  { id: "REQ-201", title: "Senior Frontend Engineer (Next.js / React)", dept: "Engineering", positions: "2 Open", applicants: 48, status: "Active", budget: "₹24L - ₹32L" },
  { id: "REQ-202", title: "Principal DevOps Architect (AWS / Kubernetes)", dept: "Infrastructure", positions: "1 Open", applicants: 29, status: "Active", budget: "₹35L - ₹45L" },
  { id: "REQ-203", title: "Lead Product Designer (Design System)", dept: "Design", positions: "1 Open", applicants: 34, status: "Active", budget: "₹20L - ₹28L" },
  { id: "REQ-204", title: "Enterprise HR Manager", dept: "Human Resources", positions: "1 Open", applicants: 18, status: "Interviewing", budget: "₹18L - ₹24L" },
]

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [requisitions, setRequisitions] = useState(initialRequisitions)
  const [searchTerm, setSearchTerm] = useState("")

  // New Req Dialog State
  const [isAddReqOpen, setIsAddReqOpen] = useState(false)
  const [reqTitle, setReqTitle] = useState("")
  const [reqDept, setReqDept] = useState("Engineering")
  const [reqBudget, setReqBudget] = useState("₹20L - ₹30L")

  const handleDeleteCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id))
  }

  const handleDeleteRequisition = (id: string) => {
    setRequisitions(requisitions.filter(r => r.id !== id))
  }

  const handleAddReq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqTitle) return
    const newReq = {
      id: `REQ-${Math.floor(200 + Math.random() * 800)}`,
      title: reqTitle,
      dept: reqDept,
      positions: "1 Open",
      applicants: 0,
      status: "Active",
      budget: reqBudget,
    }
    setRequisitions([newReq, ...requisitions])
    setReqTitle("")
    setIsAddReqOpen(false)
  }

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Offer Extended":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Offer Extended</Badge>
      case "Technical Interview":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Technical Interview</Badge>
      case "HR Screening":
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">HR Screening</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <UserPlus className="h-3.5 w-3.5" /> Kenzo Talent ATS
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Recruitment & <span className="hero-gradient-text">ATS</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage open requisitions, candidate pipelines, interview schedules, and offer letters.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4 text-blue-500" /> Career Portal
          </Button>

          <Dialog open={isAddReqOpen} onOpenChange={setIsAddReqOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Create Requisition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job Requisition</DialogTitle>
                <DialogDescription>Publish a new job opening to internal & external portals.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddReq} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Job Title</Label>
                  <Input value={reqTitle} onChange={e => setReqTitle(e.target.value)} placeholder="e.g. Senior Full-Stack Engineer" required />
                </div>
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input value={reqDept} onChange={e => setReqDept(e.target.value)} placeholder="Engineering" />
                </div>
                <div className="space-y-1">
                  <Label>Budget Range</Label>
                  <Input value={reqBudget} onChange={e => setReqBudget(e.target.value)} placeholder="₹25L - ₹35L" />
                </div>
                <Button type="submit" className="w-full">Publish Requisition</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Open Requisitions</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{requisitions.length} Open</div>
            <p className="text-xs text-muted-foreground mt-1">Across departments</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Candidates</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{candidates.length} Applicants</div>
            <p className="text-xs text-muted-foreground mt-1">In active evaluation</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">18 This Week</div>
            <p className="text-xs text-muted-foreground mt-1">Technical & HR rounds</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Offers Extended</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">5 Pending</div>
            <p className="text-xs text-muted-foreground mt-1">80% acceptance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="pipeline">Candidate Pipeline (Kanban)</TabsTrigger>
          <TabsTrigger value="requisitions">Job Requisitions ({requisitions.length})</TabsTrigger>
          <TabsTrigger value="candidates">All Candidates List ({candidates.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Kanban Pipeline */}
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
            {/* Column 1: Applied */}
            <div className="bg-muted/40 p-4 rounded-xl space-y-3 border">
              <div className="flex items-center justify-between font-semibold text-sm border-b pb-2 text-foreground">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-500" /> Applied</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <Card className="glass-card p-3 space-y-2 cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-foreground">Elena Rostova</h4>
                  <div className="flex items-center text-amber-500 text-xs font-bold">★ 4.5</div>
                </div>
                <p className="text-xs text-muted-foreground">Backend Node.js Architect</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t pt-2 mt-2">
                  <span>Applied 1d ago</span>
                  <Badge variant="outline" className="text-[9px]">Indeed</Badge>
                </div>
              </Card>
            </div>

            {/* Column 2: HR Screening */}
            <div className="bg-muted/40 p-4 rounded-xl space-y-3 border">
              <div className="flex items-center justify-between font-semibold text-sm border-b pb-2 text-foreground">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500" /> HR Screening</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <Card className="glass-card p-3 space-y-2 cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-foreground">Sophia Chen</h4>
                  <div className="flex items-center text-amber-500 text-xs font-bold">★ 4.7</div>
                </div>
                <p className="text-xs text-muted-foreground">Product Designer (UI/UX)</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t pt-2 mt-2">
                  <span>Screening Scheduled</span>
                  <Badge variant="outline" className="text-[9px]">Portal</Badge>
                </div>
              </Card>
            </div>

            {/* Column 3: Technical Interview */}
            <div className="bg-muted/40 p-4 rounded-xl space-y-3 border">
              <div className="flex items-center justify-between font-semibold text-sm border-b pb-2 text-foreground">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Technical Round</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <Card className="glass-card p-3 space-y-2 cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-foreground">Alex Rivera</h4>
                  <div className="flex items-center text-amber-500 text-xs font-bold">★ 4.9</div>
                </div>
                <p className="text-xs text-muted-foreground">Senior Frontend Engineer</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t pt-2 mt-2">
                  <span>Round 2 Complete</span>
                  <Badge variant="outline" className="text-[9px]">LinkedIn</Badge>
                </div>
              </Card>
            </div>

            {/* Column 4: Offer Extended */}
            <div className="bg-muted/40 p-4 rounded-xl space-y-3 border">
              <div className="flex items-center justify-between font-semibold text-sm border-b pb-2 text-foreground">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Offer Extended</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <Card className="glass-card p-3 space-y-2 cursor-pointer">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm text-foreground">Marcus Vance</h4>
                  <div className="flex items-center text-amber-500 text-xs font-bold">★ 5.0</div>
                </div>
                <p className="text-xs text-muted-foreground">DevOps Infrastructure Lead</p>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t pt-2 mt-2">
                  <span className="text-emerald-600 font-semibold">Offer Sent ₹38L</span>
                  <Badge className="bg-emerald-600 text-white text-[9px]">Pending</Badge>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Requisitions */}
        <TabsContent value="requisitions" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Active Job Openings</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Published job listings across company career portals and job boards.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Req ID</TableHead>
                    <TableHead className="font-bold">Job Title</TableHead>
                    <TableHead className="font-bold">Department</TableHead>
                    <TableHead className="font-bold">Open Positions</TableHead>
                    <TableHead className="font-bold">Budget Range</TableHead>
                    <TableHead className="font-bold">Applicants</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Admin Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{req.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{req.title}</TableCell>
                      <TableCell>{req.dept}</TableCell>
                      <TableCell>{req.positions}</TableCell>
                      <TableCell className="font-semibold text-emerald-600">{req.budget}</TableCell>
                      <TableCell>{req.applicants} Applicants</TableCell>
                      <TableCell><Badge variant="outline">{req.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-600"
                          onClick={() => handleDeleteRequisition(req.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Candidates List */}
        <TabsContent value="candidates" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Candidate Master List</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">Search and manage all applicant records.</CardDescription>
                </div>
                <Input 
                  placeholder="Search candidate name or role..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Candidate</TableHead>
                    <TableHead className="font-bold">Applied Role</TableHead>
                    <TableHead className="font-bold">Stage</TableHead>
                    <TableHead className="font-bold">Rating</TableHead>
                    <TableHead className="font-bold">Source</TableHead>
                    <TableHead className="text-right font-bold">Admin Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{candidate.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.role}</TableCell>
                      <TableCell>{getStageBadge(candidate.stage)}</TableCell>
                      <TableCell className="font-bold text-amber-500">★ {candidate.rating}</TableCell>
                      <TableCell><Badge variant="secondary">{candidate.source}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="outline" size="sm">
                            View Resume
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-rose-600"
                            onClick={() => handleDeleteCandidate(candidate.id)}
                          >
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
      </Tabs>
    </div>
  )
}

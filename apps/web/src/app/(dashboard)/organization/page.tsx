"use client"

import React, { useState } from "react"
import { Building2, Users, FolderTree, BadgeCheck, Plus, Trash2, UserCheck, Briefcase, Globe, ExternalLink, Mail, Phone, MapPin, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { getStoredEmployees, EmployeeRecord } from "@/lib/employee-store"
import {
  getStoredDepartments,
  addDepartment,
  deleteDepartment,
  getStoredTeams,
  addTeam,
  deleteTeam,
  getStoredDesignations,
  addDesignation,
  deleteDesignation,
  DepartmentRecord,
  TeamRecord,
  DesignationRecord,
} from "@/lib/organization-store"

export default function OrganizationPage() {
  const { isAdmin } = useAuth()
  const [employees] = useState<EmployeeRecord[]>(() => getStoredEmployees())
  const [departments, setDepartments] = useState<DepartmentRecord[]>(() => getStoredDepartments())
  const [teams, setTeams] = useState<TeamRecord[]>(() => getStoredTeams())
  const [designations, setDesignations] = useState<DesignationRecord[]>(() => getStoredDesignations())

  // Add Department State
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false)
  const [deptName, setDeptName] = useState("")
  const [deptHead, setDeptHead] = useState("")
  const [deptCode, setDeptCode] = useState("")

  // Add Team State
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamDept, setTeamDept] = useState("Engineering")
  const [teamLead, setTeamLead] = useState("Sujal Kumar")

  // Add Designation State
  const [isAddDesigOpen, setIsAddDesigOpen] = useState(false)
  const [desigCode, setDesigCode] = useState("")
  const [desigTitle, setDesigTitle] = useState("")
  const [desigBand, setDesigBand] = useState("L4 (Senior)")

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deptName) return
    const newDept: DepartmentRecord = {
      id: `DEP-${Math.floor(100 + Math.random() * 900)}`,
      name: deptName,
      head: deptHead || "Unassigned",
      code: deptCode || deptName.substring(0, 4).toUpperCase(),
    }
    const updated = addDepartment(newDept)
    setDepartments(updated)
    setDeptName("")
    setDeptHead("")
    setDeptCode("")
    setIsAddDeptOpen(false)
  }

  const handleDeleteDept = (id: string) => {
    const updated = deleteDepartment(id)
    setDepartments(updated)
  }

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName) return
    const newTeam: TeamRecord = {
      id: `TEAM-${Math.floor(100 + Math.random() * 900)}`,
      name: teamName,
      department: teamDept,
      lead: teamLead || "Sujal Kumar",
    }
    const updated = addTeam(newTeam)
    setTeams(updated)
    setTeamName("")
    setIsAddTeamOpen(false)
  }

  const handleDeleteTeam = (id: string) => {
    const updated = deleteTeam(id)
    setTeams(updated)
  }

  const handleAddDesig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!desigTitle) return
    const newDesig: DesignationRecord = {
      id: `DESIG-${Math.floor(100 + Math.random() * 900)}`,
      code: desigCode || `DSG-${Math.floor(10 + Math.random() * 90)}`,
      title: desigTitle,
      jobBand: desigBand,
    }
    const updated = addDesignation(newDesig)
    setDesignations(updated)
    setDesigTitle("")
    setDesigCode("")
    setIsAddDesigOpen(false)
  }

  const handleDeleteDesig = (id: string) => {
    const updated = deleteDesignation(id)
    setDesignations(updated)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Building2 className="h-3.5 w-3.5" /> Corporate Hierarchy & Structure
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Organization <span className="hero-gradient-text">Hierarchy</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage company departments, cross-functional teams, designations, and legal entities.</p>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          <TabsTrigger value="company" className="font-bold flex items-center gap-2">
            <Building className="h-4 w-4 text-amber-500" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="departments" className="font-bold flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-blue-500" />
            Departments ({departments.length})
          </TabsTrigger>
          <TabsTrigger value="teams" className="font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            Teams ({teams.length})
          </TabsTrigger>
          <TabsTrigger value="designations" className="font-bold flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            Designations ({designations.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 0: Company Profile (With Working Active Website Link) */}
        <TabsContent value="company" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
                    <Building className="h-5 w-5 text-amber-500" /> Kenzo Infosystems Pvt. Ltd.
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Official Corporate Entity & Global Headquarters Details
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-3 py-1">
                  Active Legal Entity
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Redirect Website Link Widget */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-background/50 hover:bg-muted/40 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">WEBSITE</div>
                    <a
                      href="https://kenzoinfosystems.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      www.kenzoinfosystems.com
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border bg-background/50">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">OFFICIAL EMAIL</div>
                    <div className="text-sm font-extrabold text-foreground mt-0.5">contact@kenzoinfosystems.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border bg-background/50">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CONTACT PHONE</div>
                    <div className="text-sm font-extrabold text-foreground mt-0.5">+91 (120) 456-7890</div>
                  </div>
                </div>
              </div>

              {/* Registered Address */}
              <div className="p-4 rounded-xl border bg-background/50 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">REGISTERED CORPORATE ADDRESS</div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    107, BR Complex, Mayur Vihar Phase 1, New Delhi - 110091
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">CIN: U72900DL2020PTC368912 • ISO 27001:2022 Certified Corporate Office</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 1: Departments (Synced Live with Employees) */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Company Departments</h3>
              <p className="text-xs text-muted-foreground">Real-time employee headcount distribution across departments.</p>
            </div>
            {isAdmin && (
              <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>Define a new functional department within the company hierarchy.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDept} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <Label>Department Name</Label>
                      <Input value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="e.g. Artificial Intelligence Labs" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Department Head</Label>
                        <Input value={deptHead} onChange={e => setDeptHead(e.target.value)} placeholder="e.g. Sujal Kumar" />
                      </div>
                      <div className="space-y-1">
                        <Label>Dept Code</Label>
                        <Input value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="e.g. AI-LAB" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary font-bold">Save Department</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => {
              // Real-time dynamic count of active employees assigned to this department
              const count = employees.filter(e => e.dept.toLowerCase() === dept.name.toLowerCase()).length
              return (
                <Card key={dept.id} className="glass-card flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-extrabold text-xs">
                        {count} Employee{count === 1 ? "" : "s"}
                      </Badge>
                      {isAdmin && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Department" onClick={() => handleDeleteDept(dept.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-xl font-extrabold text-foreground mt-2">{dept.name}</CardTitle>
                    <CardDescription className="text-xs font-medium">Head: {dept.head}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 border-t border-border pt-3 mt-1">
                      <Briefcase className="h-3.5 w-3.5 text-blue-500" /> Dept Code: {dept.code}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Teams */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Cross-Functional Teams</h3>
              <p className="text-xs text-muted-foreground">Functional team pods and operational leads.</p>
            </div>
            {isAdmin && (
              <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Team Pod</DialogTitle>
                    <DialogDescription>Create a project or operational team unit.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTeam} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <Label>Team Name</Label>
                      <Input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Platform Infrastructure" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Department</Label>
                        <Select value={teamDept} onValueChange={setTeamDept}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Dept" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(d => (
                              <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Team Lead</Label>
                        <Input value={teamLead} onChange={e => setTeamLead(e.target.value)} placeholder="Lead Name" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary font-bold">Save Team</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const memCount = employees.filter(e => e.dept.toLowerCase() === team.department.toLowerCase()).length
              return (
                <Card key={team.id} className="glass-card flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-extrabold text-xs">
                        {memCount} Active Members
                      </Badge>
                      {isAdmin && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Team" onClick={() => handleDeleteTeam(team.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <CardTitle className="text-lg font-extrabold text-foreground mt-2">{team.name}</CardTitle>
                    <CardDescription className="text-xs font-medium">Department: {team.department}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 border-t border-border pt-3 mt-1">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-500" /> Lead: {team.lead}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab 3: Designations & Job Bands (Synced Live with Employees) */}
        <TabsContent value="designations" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Company Designations & Job Bands</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Real-time synchronized designation titles, band levels, and active employee counts.</CardDescription>
              </div>
              {isAdmin && (
                <Dialog open={isAddDesigOpen} onOpenChange={setIsAddDesigOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                      <Plus className="mr-2 h-4 w-4" /> Add Designation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Designation</DialogTitle>
                      <DialogDescription>Define a new corporate title and job band level.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddDesig} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <Label>Designation Title</Label>
                        <Input value={desigTitle} onChange={e => setDesigTitle(e.target.value)} placeholder="e.g. Senior Principal Architect" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Designation Code</Label>
                          <Input value={desigCode} onChange={e => setDesigCode(e.target.value)} placeholder="ENG-L6" required />
                        </div>
                        <div className="space-y-1">
                          <Label>Job Band / Level</Label>
                          <Input value={desigBand} onChange={e => setDesigBand(e.target.value)} placeholder="L6 (Executive)" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-primary font-bold">Save Designation</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-bold text-muted-foreground">Designation Code</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Title</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Job Band / Level</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Assigned Employees</TableHead>
                    {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Admin Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((desig) => {
                    // Dynamically compute how many active employees hold this designation
                    const assignedCount = employees.filter(e => e.role.toLowerCase() === desig.title.toLowerCase()).length
                    return (
                      <TableRow key={desig.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{desig.code}</TableCell>
                        <TableCell className="font-bold text-foreground text-sm">{desig.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">{desig.jobBand}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">
                            {assignedCount} Assigned
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-500/10" title="Delete Designation" onClick={() => handleDeleteDesig(desig.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

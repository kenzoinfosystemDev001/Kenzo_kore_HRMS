"use client"

import React, { useState } from "react"
import { Building2, Users, FolderTree, BadgeCheck, Plus, Building, Globe, Trash2, UserPlus, UserMinus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { companyData, departmentsData as initialDepts, teamsData as initialTeams, designationsData as initialDesignations } from "@/features/organization/data"

export default function OrganizationPage() {
  const [departments, setDepartments] = useState(initialDepts)
  const [teams, setTeams] = useState(initialTeams)
  const [designations, setDesignations] = useState(initialDesignations)

  // Dialog States
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false)
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)
  const [deptName, setDeptName] = useState("")
  const [deptHead, setDeptHead] = useState("")
  const [teamName, setTeamName] = useState("")
  const [teamLead, setTeamLead] = useState("")

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id))
  }

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id))
  }

  const handleDeleteDesignation = (id: string) => {
    setDesignations(designations.filter(d => d.id !== id))
  }

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deptName) return
    const newD = {
      id: `dep-${Date.now()}`,
      name: deptName,
      head: deptHead || "Unassigned",
      employees: 1,
      children: 0,
    }
    setDepartments([...departments, newD])
    setDeptName("")
    setDeptHead("")
    setIsAddDeptOpen(false)
  }

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName) return
    const newT = {
      id: `team-${Date.now()}`,
      name: teamName,
      department: "Engineering",
      lead: teamLead || "Sujal Kumar",
      members: 4,
    }
    setTeams([...teams, newT])
    setTeamName("")
    setTeamLead("")
    setIsAddTeamOpen(false)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Building2 className="h-3.5 w-3.5" /> Company Structure
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Organization <span className="hero-gradient-text">Hierarchy</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage departments, cross-functional teams, designations, and legal entities.</p>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Departments ({departments.length})
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teams ({teams.length})
          </TabsTrigger>
          <TabsTrigger value="designations" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Designations ({designations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground">Kenzo Technologies Inc.</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">Primary legal entity and corporate details.</CardDescription>
              </div>
              <Button variant="outline">Edit Company Profile</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Legal Name</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{companyData.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Industry</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{companyData.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Website</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{companyData.website}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-foreground">Company Departments</h3>
            <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" /> Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>Create a new business department unit.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDept} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>Department Name</Label>
                    <Input value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="e.g. Cyber Security" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Department Head</Label>
                    <Input value={deptHead} onChange={e => setDeptHead(e.target.value)} placeholder="e.g. Sujal Kumar" />
                  </div>
                  <Button type="submit" className="w-full">Create Department</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept.id} className="glass-card flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{dept.employees} Employees</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      onClick={() => handleDeleteDept(dept.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mt-2 text-foreground">{dept.name}</CardTitle>
                  <CardDescription className="text-xs">Head: {dept.head}</CardDescription>
                </CardHeader>
                <CardFooter className="border-t pt-3">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Assign Team Members
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-foreground">Cross-Functional Teams</h3>
            <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" /> Add Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team</DialogTitle>
                  <DialogDescription>Group employees into sprint or project teams.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTeam} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>Team Name</Label>
                    <Input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Core API Guild" required />
                  </div>
                  <div className="space-y-1">
                    <Label>Team Lead</Label>
                    <Input value={teamLead} onChange={e => setTeamLead(e.target.value)} placeholder="e.g. Wade Warren" />
                  </div>
                  <Button type="submit" className="w-full">Create Team</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="glass-card flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{team.department}</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mt-2 text-foreground">{team.name}</CardTitle>
                  <CardDescription className="text-xs">Lead: {team.lead} • {team.members} Members</CardDescription>
                </CardHeader>
                <CardFooter className="border-t pt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <UserPlus className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Add Member
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs text-rose-600">
                    <UserMinus className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="designations" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Company Designations & Job Bands</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Designation Code</TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="font-bold">Job Band / Level</TableHead>
                    <TableHead className="text-right font-bold">Admin Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designations.map((des) => (
                    <TableRow key={des.id}>
                      <TableCell className="font-mono text-xs font-semibold text-primary">{des.code}</TableCell>
                      <TableCell className="font-medium text-foreground">{des.name}</TableCell>
                      <TableCell><Badge variant="outline">{des.level} ({des.band})</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-600"
                          onClick={() => handleDeleteDesignation(des.id)}
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
      </Tabs>
    </div>
  )
}

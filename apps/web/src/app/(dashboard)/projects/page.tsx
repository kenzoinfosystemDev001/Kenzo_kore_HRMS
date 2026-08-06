"use client"

import React, { useState } from "react"
import { FolderKanban, Users, CheckCircle2, Plus, Calendar, TrendingUp, UserPlus, UserMinus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/lib/auth"

const initialProjects = [
  { id: 1, name: "Kenzo HRMS Platform", client: "Internal", lead: "Sujal Kumar", members: 2, progress: 75, dueDate: "Dec 31, 2026", status: "Active" },
]

export default function ProjectsPage() {
  const { isAdmin } = useAuth()
  const [projectsList, setProjectsList] = useState(initialProjects)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newClient, setNewClient] = useState("")

  const handleAddMember = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, members: p.members + 1 } : p))
  }

  const handleRemoveMember = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id && p.members > 1 ? { ...p, members: p.members - 1 } : p))
  }

  const handleDeleteProject = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id))
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return
    const newProject = {
      id: Date.now(),
      name: newName,
      client: newClient || "Internal",
      lead: "Ankit Sethi",
      members: 1,
      progress: 0,
      dueDate: "TBD",
      status: "Active",
    }
    setProjectsList([newProject, ...projectsList])
    setNewName("")
    setNewClient("")
    setIsAddOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Active</Badge>
      case "In Review":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">In Review</Badge>
      case "Completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <FolderKanban className="h-3.5 w-3.5" /> Project Management
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Active <span className="hero-gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Track project milestones, team allocation, and delivery timelines.</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to track in the HRMS system.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Project Name</Label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Mobile App Development" required />
                </div>
                <div className="space-y-1">
                  <Label>Client / Department</Label>
                  <Input value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="Internal" />
                </div>
                <Button type="submit" className="w-full">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{projectsList.filter(p => p.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Members</CardTitle>
            <Users className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{projectsList.reduce((sum, p) => sum + p.members, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {projectsList.length ? Math.round(projectsList.reduce((sum, p) => sum + p.progress, 0) / projectsList.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{projectsList.filter(p => p.status === "Completed").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Delivered successfully</p>
          </CardContent>
        </Card>
      </div>

      {projectsList.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Projects</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first project to start tracking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projectsList.map((project) => (
            <Card key={project.id} className="glass-card hover:border-primary/40 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg font-bold text-foreground">{project.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{project.client} • Lead: {project.lead}</CardDescription>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Progress</span>
                    <span className="text-xs font-bold text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Due: {project.dueDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {project.members} Members
                  </div>
                </div>

                <div className="flex items-center gap-1 -space-x-2">
                  {Array.from({ length: Math.min(project.members, 4) }).map((_, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-background">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px]">
                        {i === 0 ? "AS" : i === 1 ? "SK" : `T${i}`}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members > 4 && (
                    <span className="text-xs text-muted-foreground ml-2">+{project.members - 4} more</span>
                  )}
                </div>
              </CardContent>
              {isAdmin && (
                <CardFooter className="border-t pt-3 flex justify-between">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleAddMember(project.id)}>
                      <UserPlus className="mr-1 h-3.5 w-3.5" /> Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemoveMember(project.id)}>
                      <UserMinus className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

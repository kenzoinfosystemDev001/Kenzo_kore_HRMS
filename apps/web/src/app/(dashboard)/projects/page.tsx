"use client"

import React, { useState } from "react"
import { FolderKanban, Clock, Users, CheckCircle2, Plus, Calendar, TrendingUp, UserPlus, UserMinus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const initialProjects = [
  { id: 1, name: "Kenzo OneERP Integration API", client: "Enterprise Core", lead: "Sujal Kumar", members: 6, progress: 85, dueDate: "Sep 15, 2026", status: "Active" },
  { id: 2, name: "Kore Expense Mobile App Revamp", client: "Kore Financials", lead: "Ralph Edwards", members: 4, progress: 95, dueDate: "Aug 28, 2026", status: "In Review" },
  { id: 3, name: "Global Payroll Tax Automation Engine", client: "Internal HR", lead: "Wade Warren", members: 5, progress: 60, dueDate: "Oct 10, 2026", status: "Active" },
  { id: 4, name: "SOC2 Compliance & Audit Shield", client: "Security Core", lead: "Jane Cooper", members: 3, progress: 100, dueDate: "Aug 01, 2026", status: "Completed" },
]

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState(initialProjects)

  const handleAddMember = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, members: p.members + 1 } : p))
  }

  const handleRemoveMember = (id: number) => {
    setProjectsList(projectsList.map(p => p.id === id && p.members > 1 ? { ...p, members: p.members - 1 } : p))
  }

  const handleDeleteProject = (id: number) => {
    setProjectsList(projectsList.filter(p => p.id !== id))
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <FolderKanban className="h-3.5 w-3.5" /> Project Operations
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Project & <span className="hero-gradient-text">Time Tracking</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Track employee billable hours, active projects, and team allocations.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">{projectsList.length} Active</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 4 this month</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">1,840 Hrs</div>
            <p className="text-xs text-muted-foreground mt-1">Current month timesheets</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Billable Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">92.4%</div>
            <p className="text-xs text-muted-foreground mt-1">High resource utilization</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">On-Time Delivery</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">96.8%</div>
            <p className="text-xs text-muted-foreground mt-1">Sprint completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projectsList.map((project) => (
          <Card key={project.id} className="glass-card flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Due {project.dueDate}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-2 text-xl text-foreground">{project.name}</CardTitle>
              <CardDescription className="text-xs">Client: {project.client} • Lead: {project.lead}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="text-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" /> {project.members} Assigned Team Members
                </div>
                <div className="flex -space-x-2">
                  {[...Array(Math.min(project.members, 4))].map((_, idx) => (
                    <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-[10px] bg-primary/20 text-primary font-bold">M{idx + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleAddMember(project.id)}>
                <UserPlus className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Add Member
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs text-rose-600" onClick={() => handleRemoveMember(project.id)}>
                <UserMinus className="mr-1 h-3.5 w-3.5" /> Remove Member
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

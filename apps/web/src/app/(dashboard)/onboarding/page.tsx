"use client"

import React from "react"
import { UserPlus, CheckSquare, Laptop, FileCheck, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface NewHire {
  name: string
  role: string
  dept: string
  joinDate: string
  progress: number
  buddy: string
  status: string
}

const newHires: NewHire[] = []

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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checklist Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending IT Assets</CardTitle>
            <Laptop className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Devices</div>
            <p className="text-xs text-muted-foreground mt-1">Devices assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doc Signatures</CardTitle>
            <FileCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 0</div>
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
          {newHires.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No active onboarding pipelines</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;Start Onboarding&quot; to begin new hire orientation.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Role & Department</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Onboarding Buddy</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
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

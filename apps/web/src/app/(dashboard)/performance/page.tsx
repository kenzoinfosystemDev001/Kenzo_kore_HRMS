"use client"

import React from "react"
import { TrendingUp, Target, Award, Star, Users, CheckCircle2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const okrs = [
  { title: "Achieve 99.9% Uptime for Core Monolith Services", category: "Engineering", progress: 85, weight: "30%", owner: "Wade Warren" },
  { title: "Redesign Employee Self-Service Mobile Dashboard", category: "Design", progress: 92, weight: "25%", owner: "Ralph Edwards" },
  { title: "Reduce Average Hiring Cycle from 45 to 30 Days", category: "Recruitment", progress: 70, weight: "20%", owner: "Jane Cooper" },
  { title: "Automate Monthly Payroll Tax Deductions Process", category: "Finance", progress: 100, weight: "25%", owner: "Kristin Watson" },
]

export default function PerformancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance & OKRs</h2>
          <p className="text-muted-foreground mt-1">Manage quarterly objectives, key results, 360° reviews, and appraisals.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Create Goal (OKR)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Review Cycle</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q3 Mid-Year Review</div>
            <p className="text-xs text-muted-foreground mt-1">Ends Sep 30, 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall OKR Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86.7%</div>
            <p className="text-xs text-muted-foreground mt-1">Company-wide average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Submitted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 / 48</div>
            <p className="text-xs text-muted-foreground mt-1">87% submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 High Exceeds</div>
            <p className="text-xs text-muted-foreground mt-1">Eligible for promotion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="okrs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="okrs">Company Goals (OKRs)</TabsTrigger>
          <TabsTrigger value="reviews">360° Performance Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="okrs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Strategic Objectives</CardTitle>
              <CardDescription>Aligned team key results for current cycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Objective / Key Result</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {okrs.map((okr, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{okr.title}</TableCell>
                      <TableCell>{okr.category}</TableCell>
                      <TableCell>{okr.owner}</TableCell>
                      <TableCell>{okr.weight}</TableCell>
                      <TableCell className="w-44">
                        <div className="flex items-center gap-2">
                          <Progress value={okr.progress} className="h-2 flex-1" />
                          <span className="text-xs font-semibold">{okr.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={okr.progress === 100 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}>
                          {okr.progress === 100 ? "Achieved" : "On Track"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Self & Manager Appraisals</CardTitle>
              <CardDescription>Status of active performance evaluation forms.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-sm text-muted-foreground">
              360° reviews are actively open for Q3 cycle. 87% of self-evaluations have been submitted to managers for final review.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

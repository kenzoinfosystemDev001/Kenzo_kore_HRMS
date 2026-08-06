"use client"

import React from "react"
import { BookOpen, Award, CheckCircle2, PlayCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Course {
  title: string
  provider: string
  duration: string
  enrolled: number
  category: string
  rating: string
}

const courses: Course[] = []

export default function TrainingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Training & LMS</h2>
          <p className="text-muted-foreground mt-1">Explore company learning courses, compliance certifications, and skill tracks.</p>
        </div>
        <Button className="bg-primary">
          <BookOpen className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Active</div>
            <p className="text-xs text-muted-foreground mt-1">0 compliance tracks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Hours</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Hrs</div>
            <p className="text-xs text-muted-foreground mt-1">Team total this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications Earned</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Verified certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Pass Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground mt-1">SOC2 requirement</p>
          </CardContent>
        </Card>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground">No training courses assigned yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click &quot;Add Course&quot; to create a new learning module.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course, i) => (
            <Card key={i} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{course.category}</Badge>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    ★ {course.rating}
                  </div>
                </div>
                <CardTitle className="mt-2 text-xl">{course.title}</CardTitle>
                <CardDescription>{course.provider} • {course.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{course.enrolled} Employees Enrolled</span>
                  <span className="font-semibold text-primary">In Progress</span>
                </div>
                <Progress value={65} className="h-2" />
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4 text-primary" /> Continue Learning
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

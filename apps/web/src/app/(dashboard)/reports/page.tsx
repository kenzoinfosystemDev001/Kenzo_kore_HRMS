"use client"

import React from "react"
import { BarChart3, Download, PieChart, TrendingUp, Users, Calendar, DollarSign, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const reportTemplates = [
  { title: "Headcount & Demographic Attrition Analysis", category: "Workforce", icon: Users, desc: "Detailed breakdown of employee growth, turnover rate, and gender diversity by department." },
  { title: "Monthly Payroll & Tax Compliance Summary", category: "Finance", icon: DollarSign, desc: "Comprehensive salary expenditure, PF deductions, tax withholdings, and gross payout reports." },
  { title: "Biometric Attendance & Overtime Analytics", category: "Operations", icon: Calendar, desc: "Shift adherence, late clock-in patterns, leave utilization, and overtime hours analysis." },
  { title: "SOC2 Audit & Security Access Trail Report", category: "Compliance", icon: ShieldCheck, desc: "User login activity, permission updates, document downloads, and tenant audit trails." },
]

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics Engine</h2>
          <p className="text-muted-foreground mt-1">Export executive workforce reports, compliance audits, and custom data filters.</p>
        </div>
        <Button className="bg-primary">
          <Download className="mr-2 h-4 w-4" /> Export All Data (CSV/PDF)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTemplates.map((report, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <Badge variant="outline" className="mb-2">{report.category}</Badge>
                <CardTitle className="text-xl">{report.title}</CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <report.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {report.desc}
              </CardDescription>
              <div className="flex gap-2 mt-6">
                <Button size="sm" variant="outline" className="flex-1">
                  <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                </Button>
                <Button size="sm" className="bg-primary">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

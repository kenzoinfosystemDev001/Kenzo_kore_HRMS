"use client"

import React from "react"
import { Boxes, Zap, CheckCircle2, Globe, Shield, ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const integrations = [
  { name: "Kenzo OneERP Integration", category: "ERP Core", desc: "Master sync for employee headcount, organizational hierarchy, and cost centers.", status: "Connected" },
  { name: "Kore Expense Sync", category: "Expense & Finance", desc: "Automated reimbursement payouts and credit card receipt reconciliation.", status: "Connected" },
  { name: "DAP Analytics Bridge", category: "Data Platform", desc: "Real-time workforce metric event publishing and predictive attrition streaming.", status: "Available" },
  { name: "Salesforce CRM Sync", category: "CRM", desc: "Map sales quotas, incentive bonuses, and commission payouts into monthly payroll.", status: "Connected" },
  { name: "Slack & Microsoft Teams Bot", category: "Communication", desc: "Instant leave approval notifications, daily clock-in alerts, and AI HR copilot.", status: "Connected" },
  { name: "QuickBooks & Xero Accounting", category: "Finance", desc: "Export monthly payroll journal entries and statutory tax filings directly.", status: "Available" },
]

export default function IntegrationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Integrations & Webhooks</h2>
          <p className="text-muted-foreground mt-1">Connect Kenzo HRMS master employee data to ERP, Kore Expense, DAP, CRM, and accounting tools.</p>
        </div>
        <Button className="bg-primary">
          <Zap className="mr-2 h-4 w-4" /> Create Webhook / API Key
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {integrations.map((item, i) => (
          <Card key={i} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.category}</Badge>
                <Badge className={item.status === "Connected" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                  {item.status}
                </Badge>
              </div>
              <CardTitle className="mt-3 text-lg">{item.name}</CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">{item.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span>Configure Pipeline</span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

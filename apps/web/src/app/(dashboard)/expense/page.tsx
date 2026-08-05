"use client"

import React, { useState } from "react"
import { Receipt, DollarSign, Clock, CheckCircle2, XCircle, Plus, Download, FileText, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const expenseClaims = [
  { id: "EXP-8901", employee: "Jenny Wilson", category: "Travel & Mileage", amount: "₹14,500", date: "Aug 02, 2026", merchant: "Uber & Indigo", status: "Approved" },
  { id: "EXP-8902", employee: "Devon Lane", category: "Client Entertainment", amount: "₹8,200", date: "Aug 03, 2026", merchant: "The Taj Hotel", status: "Pending" },
  { id: "EXP-8903", employee: "Dianne Russell", category: "Software Subscription", amount: "₹4,999", date: "Aug 04, 2026", merchant: "JetBrains", status: "Approved" },
  { id: "EXP-8904", employee: "Cody Fisher", category: "Office Supplies", amount: "₹3,450", date: "Aug 04, 2026", merchant: "Amazon Business", status: "Rejected" },
  { id: "EXP-8905", employee: "Esther Howard", category: "Training & Certification", amount: "₹25,000", date: "Aug 05, 2026", merchant: "AWS Exam", status: "Pending" },
]

export default function ExpensePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Approved</Badge>
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending Approval</Badge>
      case "Rejected":
        return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground mt-1">Track employee reimbursements, travel claims, and receipts.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Submit Expense Claim
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹56,149</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting manager review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹19,499</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Settlement Time</CardTitle>
            <Receipt className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Faster than industry avg</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Expense Claims</CardTitle>
              <CardDescription>Employee reimbursement submissions and status.</CardDescription>
            </div>
            <Input 
              placeholder="Search employee or expense..." 
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
                <TableHead>Claim ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono text-xs">{claim.id}</TableCell>
                  <TableCell className="font-medium">{claim.employee}</TableCell>
                  <TableCell>{claim.category}</TableCell>
                  <TableCell>{claim.merchant}</TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell className="font-semibold">{claim.amount}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

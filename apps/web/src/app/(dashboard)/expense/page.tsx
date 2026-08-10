"use client"

import React, { useState } from "react"
import { Receipt, DollarSign, Clock, CheckCircle2, Plus, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import {
  getStoredExpenses,
  addExpenseClaim,
  updateExpenseStatus,
  ExpenseClaimRecord,
} from "@/lib/expense-store"

export default function ExpensePage() {
  const { user, isAdmin } = useAuth()
  const [expenses, setExpenses] = useState<ExpenseClaimRecord[]>(() => getStoredExpenses())
  const [searchTerm, setSearchTerm] = useState("")

  // Submit Expense Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [category, setCategory] = useState("Travel & Transport")
  const [merchant, setMerchant] = useState("")
  const [amountInput, setAmountInput] = useState("")
  const [notesInput, setNotesInput] = useState("")
  const [receiptUrl, setReceiptUrl] = useState("")

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!merchant || !amountInput) return

    const numAmount = parseFloat(amountInput) || 0
    const newClaim: ExpenseClaimRecord = {
      id: `EXP-2026-${Math.floor(800 + Math.random() * 200)}`,
      employeeName: user?.name || "Employee",
      employeeEmail: user?.email || "employee@kenzo.com",
      category,
      merchant,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      amount: `₹${numAmount.toLocaleString("en-IN")}`,
      notes: notesInput || "Corporate business expense reimbursement request.",
      receiptUrl: receiptUrl || undefined,
      status: "Pending",
    }

    const updated = addExpenseClaim(newClaim)
    setExpenses(updated)
    setIsSubmitOpen(false)
    setMerchant("")
    setAmountInput("")
    setNotesInput("")
    setReceiptUrl("")
  }

  const handleApprove = (id: string) => {
    const updated = updateExpenseStatus(id, "Approved", "Approved for corporate accounts payout.")
    setExpenses(updated)
  }

  const handleReject = (id: string) => {
    const updated = updateExpenseStatus(id, "Rejected", "Receipt details required.")
    setExpenses(updated)
  }

  const visibleExpenses = isAdmin
    ? expenses
    : expenses.filter(e => e.employeeEmail.toLowerCase() === user?.email?.toLowerCase())

  const filtered = visibleExpenses.filter(c =>
    c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">Approved</Badge>
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">Pending Approval</Badge>
      case "Rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const parseAmountNum = (str: string) => {
    const clean = str.replace(/[₹,]/g, "")
    return parseFloat(clean) || 0
  }

  const totalExpenseNum = visibleExpenses.reduce((acc, curr) => acc + parseAmountNum(curr.amount), 0)
  const approvedAmountNum = visibleExpenses
    .filter(e => e.status === "Approved")
    .reduce((acc, curr) => acc + parseAmountNum(curr.amount), 0)
  const pendingCount = visibleExpenses.filter(e => e.status === "Pending").length

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Receipt className="h-3.5 w-3.5 text-blue-500" /> Corporate Reimbursements & Expense Operations
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Expense <span className="hero-gradient-text">Management</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Track employee reimbursements, travel claims, merchant invoices, and receipts.</p>
        </div>

        {/* Submit Expense Claim CTA Dialog */}
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Submit Expense Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-500" /> Submit Reimbursement Claim
              </DialogTitle>
              <DialogDescription>Submit business expenses and merchant receipts for manager approval.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleExpenseSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>Expense Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel & Transport">Travel & Transport</SelectItem>
                    <SelectItem value="Food & Meals">Food & Meals</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Medical Reimbursement">Medical Reimbursement</SelectItem>
                    <SelectItem value="Internet & Phone">Internet & Phone</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Merchant / Vendor</Label>
                  <Input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder="e.g. Uber / Amazon / Indigo" required />
                </div>
                <div className="space-y-1">
                  <Label>Claim Amount (₹)</Label>
                  <Input type="number" value={amountInput} onChange={e => setAmountInput(e.target.value)} placeholder="1850" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Purpose / Notes</Label>
                <Input value={notesInput} onChange={e => setNotesInput(e.target.value)} placeholder="Official client visit / office equipment..." required />
              </div>

              <div className="space-y-1">
                <Label>Receipt Attachment Link (Optional)</Label>
                <Input value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} placeholder="https://... (Receipt Image URL)" />
              </div>

              <Button type="submit" className="w-full bg-primary font-bold">Submit Claim for Payout</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalExpenseNum.toLocaleString("en-IN")}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Submitted claims history</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Awaiting manager approval</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approved Amount</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{approvedAmountNum.toLocaleString("en-IN")}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Ready for accounts payout</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Settlement Time</CardTitle>
            <Receipt className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">24 Hours</div>
            <p className="text-[11px] text-muted-foreground mt-1">Fast-track reimbursement policy</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Expense Table */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Corporate Expense Submissions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Employee reimbursement submissions, merchant receipts, and approval tracking.</CardDescription>
            </div>
            <Input 
              placeholder="Search employee, merchant or category..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="max-w-xs text-foreground bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No expense claims found</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;Submit Expense Claim&quot; to create a new reimbursement.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-bold text-muted-foreground">Claim ID</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Category</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Merchant</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Date</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Amount</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                  {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/40 border-border">
                    <TableCell className="font-mono text-xs font-semibold text-primary">{claim.id}</TableCell>
                    <TableCell className="font-bold text-foreground text-sm">{claim.employeeName}</TableCell>
                    <TableCell className="text-xs font-medium">{claim.category}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{claim.merchant}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{claim.date}</TableCell>
                    <TableCell className="font-bold text-foreground text-sm">{claim.amount}</TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        {claim.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(claim.id)}>
                              <Check className="mr-1 h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 border-rose-200 dark:border-rose-800" onClick={() => handleReject(claim.id)}>
                              <X className="mr-1 h-3.5 w-3.5" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-semibold">Processed</span>
                        )}
                      </TableCell>
                    )}
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

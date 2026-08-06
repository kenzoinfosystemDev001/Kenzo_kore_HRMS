"use client"

import React, { useState } from "react"
import { Eye, Wallet, Plus, Printer, Building2, CheckCircle2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAuth } from "@/lib/auth"
import { getStoredEmployees, EmployeeRecord } from "@/lib/employee-store"
import { getStoredPayslips, addStoredPayslip, PayslipRecord } from "@/lib/payslip-store"

export default function PayrollPage() {
  const { user, isAdmin } = useAuth()
  const [employees] = useState<EmployeeRecord[]>(() => getStoredEmployees())
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => getStoredPayslips())
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null)
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)

  // Generate Payslip Form State
  const [targetEmpEmail, setTargetEmpEmail] = useState("")
  const [payMonth, setPayMonth] = useState("August 2026")
  const [grossInput, setGrossInput] = useState("237500")
  const [deductionsInput, setDeductionsInput] = useState("22500")

  // Filtered lists
  const myPayslips = payslips.filter(p => p.employeeEmail.toLowerCase() === user?.email?.toLowerCase())
  const latestNet = myPayslips[0]?.net || "₹0"

  const handleGeneratePayslip = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = employees.find(e => e.email === targetEmpEmail) || employees[0]
    if (!emp) return

    const grossNum = parseFloat(grossInput) || 0
    const dedNum = parseFloat(deductionsInput) || 0
    const netNum = Math.max(0, grossNum - dedNum)

    const basicNum = Math.round(grossNum * 0.5)
    const hraNum = Math.round(grossNum * 0.25)
    const specialNum = grossNum - basicNum - hraNum

    const pfNum = Math.round(dedNum * 0.35)
    const tdsNum = dedNum - pfNum

    const newSlip: PayslipRecord = {
      id: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: emp.name,
      employeeEmail: emp.email,
      month: payMonth,
      gross: `₹${grossNum.toLocaleString("en-IN")}`,
      deductions: `₹${dedNum.toLocaleString("en-IN")}`,
      net: `₹${netNum.toLocaleString("en-IN")}`,
      status: "Paid",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      basicPay: `₹${basicNum.toLocaleString("en-IN")}`,
      hra: `₹${hraNum.toLocaleString("en-IN")}`,
      specialAllowance: `₹${specialNum.toLocaleString("en-IN")}`,
      pfDeduction: `₹${pfNum.toLocaleString("en-IN")}`,
      tdsDeduction: `₹${tdsNum.toLocaleString("en-IN")}`,
    }

    const updated = addStoredPayslip(newSlip)
    setPayslips(updated)
    setIsGenerateOpen(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Wallet className="h-3.5 w-3.5" /> Corporate Payroll Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payroll & <span className="hero-gradient-text">Payslips</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage salary statements, issue monthly payslips, and export PDF records.</p>
        </div>

        {/* Admin Payslip Generation CTA */}
        {isAdmin && (
          <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Issue New Payslip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue Employee Payslip</DialogTitle>
                <DialogDescription>Generate and publish monthly salary slip for real-time employee view.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGeneratePayslip} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Select Employee</Label>
                  <Select value={targetEmpEmail} onValueChange={setTargetEmpEmail} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(e => (
                        <SelectItem key={e.id} value={e.email}>{e.name} ({e.role})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Pay Month & Year</Label>
                  <Input value={payMonth} onChange={e => setPayMonth(e.target.value)} placeholder="August 2026" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Gross Pay (₹)</Label>
                    <Input type="number" value={grossInput} onChange={e => setGrossInput(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Total Deductions (₹)</Label>
                    <Input type="number" value={deductionsInput} onChange={e => setDeductionsInput(e.target.value)} required />
                  </div>
                </div>

                <div className="p-3 bg-muted/40 rounded-xl border text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Calculated Net Pay:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{Math.max(0, (parseFloat(grossInput) || 0) - (parseFloat(deductionsInput) || 0)).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Issue & Sync Payslip
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="my-payslips" className="space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="my-payslips">My Payslips ({myPayslips.length})</TabsTrigger>
          {isAdmin && <TabsTrigger value="company-payroll">Master Company Payroll ({payslips.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="my-payslips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="glass-card border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Latest Net Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{latestNet}</div>
                <p className="text-xs text-muted-foreground mt-1">Direct deposit completed</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Payslips Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">{myPayslips.length} Slips</div>
                <p className="text-xs text-muted-foreground mt-1">Verified records</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verification & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">100% Tax Compliant</div>
                <p className="text-xs text-muted-foreground mt-1">TDS & PF Deposited</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">My Monthly Payslip History</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Real-time issued salary slips. View, print, or download PDF statements.</CardDescription>
            </CardHeader>
            <CardContent>
              {myPayslips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No Payslips Issued Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Payslips will automatically sync here in real time as soon as the Admin issues them.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Payslip ID</TableHead>
                      <TableHead className="font-bold">Pay Month</TableHead>
                      <TableHead className="font-bold">Gross Pay</TableHead>
                      <TableHead className="font-bold">Deductions</TableHead>
                      <TableHead className="font-bold">Net Payable</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPayslips.map((payslip) => (
                      <TableRow key={payslip.id}>
                        <TableCell className="font-mono text-xs font-semibold text-primary">{payslip.id}</TableCell>
                        <TableCell className="font-medium text-foreground">{payslip.month}</TableCell>
                        <TableCell>{payslip.gross}</TableCell>
                        <TableCell className="text-rose-600 font-medium">{payslip.deductions}</TableCell>
                        <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{payslip.net}</TableCell>
                        <TableCell><Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{payslip.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(payslip)}>
                            <Eye className="mr-2 h-3.5 w-3.5 text-blue-500" /> View / Print PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="company-payroll" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Company Master Payroll Registry</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Admin view of all issued employee salary slips across the organization.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Payslip ID</TableHead>
                      <TableHead className="font-bold">Employee Name</TableHead>
                      <TableHead className="font-bold">Pay Month</TableHead>
                      <TableHead className="font-bold">Gross Pay</TableHead>
                      <TableHead className="font-bold">Deductions</TableHead>
                      <TableHead className="font-bold">Net Salary</TableHead>
                      <TableHead className="font-bold">Issued Date</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-mono text-xs font-semibold text-primary">{slip.id}</TableCell>
                        <TableCell className="font-semibold text-foreground">{slip.employeeName}</TableCell>
                        <TableCell>{slip.month}</TableCell>
                        <TableCell>{slip.gross}</TableCell>
                        <TableCell className="text-rose-600">{slip.deductions}</TableCell>
                        <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{slip.net}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{slip.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(slip)}>
                            <FileText className="mr-2 h-3.5 w-3.5 text-indigo-500" /> View Document
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Official Printable Payslip Document Modal */}
      {selectedPayslip && (
        <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div id="printable-payslip" className="p-6 bg-card rounded-xl space-y-6 text-foreground border">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-extrabold text-foreground">Kenzo Infosystems Pvt. Ltd.</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Sector 62, Tech Hub, Noida, UP 201301, India</p>
                  <p className="text-xs text-muted-foreground">CIN: U72900UP2020PTC123456 • HRMS Payroll System</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">{selectedPayslip.id}</Badge>
                  <p className="text-xs font-bold mt-2 text-foreground">SALARY SLIP: {selectedPayslip.month}</p>
                </div>
              </div>

              {/* Employee Summary Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-4 rounded-xl border">
                <div>
                  <span className="text-muted-foreground uppercase font-semibold">Employee Name:</span>
                  <p className="font-bold text-sm text-foreground">{selectedPayslip.employeeName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase font-semibold">Work Email:</span>
                  <p className="font-bold text-sm text-foreground">{selectedPayslip.employeeEmail}</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase font-semibold">Payment Status:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Paid Direct Deposit</p>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase font-semibold">Issue Date:</span>
                  <p className="font-bold text-foreground">{selectedPayslip.date}</p>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Earnings Component</TableHead>
                      <TableHead className="text-right font-bold">Amount (₹)</TableHead>
                      <TableHead className="font-bold">Deduction Component</TableHead>
                      <TableHead className="text-right font-bold">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    <TableRow>
                      <TableCell>Basic Salary</TableCell>
                      <TableCell className="text-right font-mono">{selectedPayslip.basicPay}</TableCell>
                      <TableCell>Provident Fund (PF)</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">{selectedPayslip.pfDeduction}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>House Rent Allowance (HRA)</TableCell>
                      <TableCell className="text-right font-mono">{selectedPayslip.hra}</TableCell>
                      <TableCell>Income Tax (TDS)</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">{selectedPayslip.tdsDeduction}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Special Allowance</TableCell>
                      <TableCell className="text-right font-mono">{selectedPayslip.specialAllowance}</TableCell>
                      <TableCell>Professional Tax</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">₹0</TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-muted/30">
                      <TableCell>Total Gross Earnings</TableCell>
                      <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400">{selectedPayslip.gross}</TableCell>
                      <TableCell>Total Deductions</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">{selectedPayslip.deductions}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Net Pay Callout */}
              <div className="flex justify-between items-center bg-primary/10 border border-primary/30 p-4 rounded-xl">
                <div>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Total Net Payable</p>
                  <p className="text-xs text-muted-foreground">Transferred via Corporate NEFT/RTGS</p>
                </div>
                <div className="text-2xl font-extrabold text-primary font-mono">
                  {selectedPayslip.net}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedPayslip(null)}>Close</Button>
                <Button onClick={handlePrint} className="bg-primary text-primary-foreground font-semibold">
                  <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

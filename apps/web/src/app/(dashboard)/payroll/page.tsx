"use client"

import React, { useState } from "react"
import { Eye, Wallet, Plus, Printer, Building2, FileText, Sparkles, X } from "lucide-react"

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
import { addTargetNotification, getNotificationsForUser, markNotificationAsRead } from "@/lib/notification-store"

export default function PayrollPage() {
  const { user, isAdmin } = useAuth()
  const [employees] = useState<EmployeeRecord[]>(() => getStoredEmployees())
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => getStoredPayslips())
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null)
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [dismissedPopupId, setDismissedPopupId] = useState<string | null>(null)

  // Derived state for unread isolated payslip notification
  const employeePopupNotif = user?.email
    ? getNotificationsForUser(user.email).find(n => !n.isRead && n.type === "PAYSLIP" && n.id !== dismissedPopupId) || null
    : null

  // Custom Salary Components Form State for Admin
  const [targetEmpEmail, setTargetEmpEmail] = useState("")
  const [payMonth, setPayMonth] = useState("August 2026")
  const [basicInput, setBasicInput] = useState("6000")
  const [hraInput, setHraInput] = useState("3000")
  const [specialInput, setSpecialInput] = useState("3000")
  const [pfInput, setPfInput] = useState("0")
  const [tdsInput, setTdsInput] = useState("0")

  const handleOpenPopupPayslip = () => {
    if (!employeePopupNotif) return
    markNotificationAsRead(employeePopupNotif.id)
    
    // Find payslip or fallback to employee's latest
    const match = payslips.find(p => p.id === employeePopupNotif.payslipId) ||
      payslips.find(p => p.employeeEmail.toLowerCase() === user?.email?.toLowerCase())
    
    if (match) {
      setSelectedPayslip(match)
    }
    setDismissedPopupId(employeePopupNotif.id)
  }

  // Calculate live dynamic gross & net for Admin input preview
  const basicNum = parseFloat(basicInput) || 0
  const hraNum = parseFloat(hraInput) || 0
  const specialNum = parseFloat(specialInput) || 0
  const pfNum = parseFloat(pfInput) || 0
  const tdsNum = parseFloat(tdsInput) || 0

  const calculatedGross = basicNum + hraNum + specialNum
  const calculatedDeductions = pfNum + tdsNum
  const calculatedNet = Math.max(0, calculatedGross - calculatedDeductions)

  const handleGeneratePayslip = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = employees.find(e => e.email === targetEmpEmail) || employees[0]
    if (!emp) return

    const newSlip: PayslipRecord = {
      id: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeName: emp.name,
      employeeEmail: emp.email,
      month: payMonth,
      basicPay: `₹${basicNum.toLocaleString("en-IN")}`,
      allowances: `₹${(hraNum + specialNum).toLocaleString("en-IN")}`,
      deductions: `₹${calculatedDeductions.toLocaleString("en-IN")}`,
      netPay: `₹${calculatedNet.toLocaleString("en-IN")}`,
      gross: `₹${calculatedGross.toLocaleString("en-IN")}`,
      net: `₹${calculatedNet.toLocaleString("en-IN")}`,
      status: "Paid",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      issuedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      hra: `₹${hraNum.toLocaleString("en-IN")}`,
      specialAllowance: `₹${specialNum.toLocaleString("en-IN")}`,
      pfDeduction: `₹${pfNum.toLocaleString("en-IN")}`,
      tdsDeduction: `₹${tdsNum.toLocaleString("en-IN")}`,
    }

    addStoredPayslip(newSlip)
    setPayslips(getStoredPayslips())

    // Publish isolated target notification exclusively to target employee
    addTargetNotification({
      targetEmail: emp.email.toLowerCase(),
      title: "🎉 New Salary Slip Issued!",
      message: `Your official salary slip for ${payMonth} has been issued. Total Net Payable: ₹${calculatedNet.toLocaleString("en-IN")}.`,
      type: "PAYSLIP",
      payslipId: newSlip.id,
      date: new Date().toLocaleDateString(),
      isRead: false,
    })

    setIsGenerateOpen(false)
  }

  const handlePrint = () => {
    window.print()
  }

  // Filtered lists for isolation
  const myPayslips = payslips.filter(p => p.employeeEmail.toLowerCase() === user?.email?.toLowerCase())
  const latestNet = myPayslips[0]?.net || "₹0"

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Isolated Pop-Up Notification Toast Banner for Particular Employee */}
      {employeePopupNotif && (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-background to-blue-950/80 p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                {employeePopupNotif.title}
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Isolated Security Notice</Badge>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">{employeePopupNotif.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleOpenPopupPayslip} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
              <Eye className="mr-1.5 h-3.5 w-3.5" /> View Confidential Payslip
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDismissedPopupId(employeePopupNotif.id)} className="h-8 w-8 p-0 text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Wallet className="h-3.5 w-3.5" /> Corporate Payroll Engine & Salary Slips
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Payroll & <span className="hero-gradient-text">Payslips</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage salary statements, issue custom monthly payslips, and export PDF documents.</p>
        </div>

        {/* Admin Payslip Generation CTA */}
        {isAdmin && (
          <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Issue New Payslip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" /> Issue Employee Payslip
                </DialogTitle>
                <DialogDescription>Define custom salary earnings (Basic, HRA, Special) and notify the target employee.</DialogDescription>
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

                {/* Custom Salary Earnings Inputs for Admin */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Custom Earnings Components (₹)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Basic Salary</Label>
                      <Input type="number" value={basicInput} onChange={e => setBasicInput(e.target.value)} placeholder="6000" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">HRA</Label>
                      <Input type="number" value={hraInput} onChange={e => setHraInput(e.target.value)} placeholder="3000" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Special Allowance</Label>
                      <Input type="number" value={specialInput} onChange={e => setSpecialInput(e.target.value)} placeholder="3000" required />
                    </div>
                  </div>
                </div>

                {/* Custom Deductions Inputs for Admin */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Custom Deduction Components (₹)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">PF Deduction</Label>
                      <Input type="number" value={pfInput} onChange={e => setPfInput(e.target.value)} placeholder="0" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Income Tax (TDS)</Label>
                      <Input type="number" value={tdsInput} onChange={e => setTdsInput(e.target.value)} placeholder="0" required />
                    </div>
                  </div>
                </div>

                {/* Live Dynamic Computation Preview */}
                <div className="rounded-xl border bg-muted/40 p-4 space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Total Gross Earnings:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{calculatedGross.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Deductions:</span>
                    <span className="font-mono text-rose-600 font-bold">₹{calculatedDeductions.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm border-t pt-1.5">
                    <span>Net Payable Salary:</span>
                    <span className="font-mono text-primary font-black">₹{calculatedNet.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary font-bold">Issue & Publish Isolated Payslip</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Last Net Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{latestNet}</div>
            <p className="text-xs text-muted-foreground mt-1">Transferred via Direct Deposit</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Issued Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{isAdmin ? payslips.length : myPayslips.length} Statements</div>
            <p className="text-xs text-muted-foreground mt-1">Verified corporate records</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Corporate Tax Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">FY 2026-27</div>
            <p className="text-xs text-muted-foreground mt-1">Form 16 & Tax declarations active</p>
          </CardContent>
        </Card>
      </div>

      {/* Payslips Table Tabs */}
      <Tabs defaultValue="my-slips" className="space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          <TabsTrigger value="my-slips" className="font-bold">My Personal Salary Slips</TabsTrigger>
          {isAdmin && <TabsTrigger value="all-slips" className="font-bold">Company Master Registry ({payslips.length})</TabsTrigger>}
        </TabsList>

        {/* Tab 1: Personal Payslips */}
        <TabsContent value="my-slips" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">My Monthly Payslip Records</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Download or view your confidential salary slips.</CardDescription>
            </CardHeader>
            <CardContent>
              {myPayslips.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No payslips issued for your account yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="font-bold">Payslip ID</TableHead>
                      <TableHead className="font-bold">Pay Month</TableHead>
                      <TableHead className="font-bold">Gross Pay</TableHead>
                      <TableHead className="font-bold">Deductions</TableHead>
                      <TableHead className="font-bold">Net Salary</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPayslips.map((slip) => (
                      <TableRow key={slip.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{slip.id}</TableCell>
                        <TableCell className="font-bold text-foreground text-sm">{slip.month}</TableCell>
                        <TableCell className="font-mono text-xs">{slip.gross}</TableCell>
                        <TableCell className="font-mono text-xs text-rose-600">{slip.deductions}</TableCell>
                        <TableCell className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{slip.net}</TableCell>
                        <TableCell><Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">{slip.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setSelectedPayslip(slip)}>
                            <FileText className="mr-1.5 h-3.5 w-3.5 text-indigo-500" /> View Document
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

        {/* Tab 2: Admin Company Registry */}
        {isAdmin && (
          <TabsContent value="all-slips" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Company Master Salary Registry</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">All employee payslips generated across the company.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
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
                      <TableRow key={slip.id} className="hover:bg-muted/40 border-border">
                        <TableCell className="font-mono text-xs font-semibold text-primary">{slip.id}</TableCell>
                        <TableCell className="font-bold text-foreground text-sm">{slip.employeeName}</TableCell>
                        <TableCell className="text-xs font-semibold">{slip.month}</TableCell>
                        <TableCell className="font-mono text-xs">{slip.gross}</TableCell>
                        <TableCell className="font-mono text-xs text-rose-600">{slip.deductions}</TableCell>
                        <TableCell className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{slip.net}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{slip.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setSelectedPayslip(slip)}>
                            <FileText className="mr-1.5 h-3.5 w-3.5 text-indigo-500" /> View Document
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
              {/* Header with Updated Official Corporate Address */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-extrabold text-foreground">Kenzo Infosystems Pvt. Ltd.</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">107, BR Complex, Mayur Vihar Phase 1, New Delhi - 110091</p>
                  <p className="text-xs text-muted-foreground">CIN: U72900UP2020PTC123456 • HRMS Payroll System</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">{selectedPayslip.id}</Badge>
                  <p className="text-xs font-bold mt-2 text-foreground uppercase">SALARY SLIP: {selectedPayslip.month}</p>
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
                      <TableCell className="font-medium">Basic Salary</TableCell>
                      <TableCell className="text-right font-mono font-bold">{selectedPayslip.basicPay}</TableCell>
                      <TableCell className="font-medium">Provident Fund (PF)</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">{selectedPayslip.pfDeduction}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">House Rent Allowance (HRA)</TableCell>
                      <TableCell className="text-right font-mono font-bold">{selectedPayslip.hra}</TableCell>
                      <TableCell className="font-medium">Income Tax (TDS)</TableCell>
                      <TableCell className="text-right font-mono text-rose-600">{selectedPayslip.tdsDeduction}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Special Allowance</TableCell>
                      <TableCell className="text-right font-mono font-bold">{selectedPayslip.specialAllowance}</TableCell>
                      <TableCell className="font-medium">Professional Tax</TableCell>
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
                <div className="text-2xl font-black text-primary font-mono">
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

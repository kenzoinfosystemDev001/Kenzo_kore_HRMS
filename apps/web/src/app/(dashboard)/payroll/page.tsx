"use client"

import React, { useState } from "react"
import { DollarSign, Users, Clock, CheckCircle2, PlayCircle, Download, FileText, Settings, AlertCircle, Eye, Printer, Building2, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { payrollStats, payrollHistory } from "@/features/payroll/data"

const myPayslips = [
  { id: "PAY-2026-08", month: "August 2026", gross: "₹1,25,000", deductions: "₹15,000", net: "₹1,10,000", status: "Paid", date: "Aug 01, 2026" },
  { id: "PAY-2026-07", month: "July 2026", gross: "₹1,25,000", deductions: "₹15,000", net: "₹1,10,000", status: "Paid", date: "Jul 01, 2026" },
  { id: "PAY-2026-06", month: "June 2026", gross: "₹1,25,000", deductions: "₹15,000", net: "₹1,10,000", status: "Paid", date: "Jun 01, 2026" },
  { id: "PAY-2026-05", month: "May 2026", gross: "₹1,20,000", deductions: "₹14,200", net: "₹1,05,800", status: "Paid", date: "May 01, 2026" },
]

export default function PayrollPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<typeof myPayslips[0] | null>(null)

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Paid":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200">Paid</Badge>
      case "Processing":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">Processing</Badge>
      case "Pending":
        return <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll & Payslips</h2>
          <p className="text-muted-foreground mt-1">View your monthly payslips, download statements, and manage company payroll.</p>
        </div>
      </div>

      <Tabs defaultValue="my-payslips" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-payslips">My Payslips (Employee)</TabsTrigger>
          <TabsTrigger value="company-payroll">Company Payroll (Admin)</TabsTrigger>
        </TabsList>

        <TabsContent value="my-payslips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Net Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">₹1,10,000</div>
                <p className="text-xs text-muted-foreground mt-1">August 2026 • Credited</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">YTD Gross Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹10,00,000</div>
                <p className="text-xs text-muted-foreground mt-1">Financial Year 2026-27</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax Deducted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">₹1,20,000</div>
                <p className="text-xs text-muted-foreground mt-1">TDS Deposited</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Payslip History</CardTitle>
              <CardDescription>Download or print your monthly salary statements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payslip ID</TableHead>
                    <TableHead>Month & Year</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-mono text-xs">{payslip.id}</TableCell>
                      <TableCell className="font-medium">{payslip.month}</TableCell>
                      <TableCell>{payslip.gross}</TableCell>
                      <TableCell className="text-rose-600">{payslip.deductions}</TableCell>
                      <TableCell className="font-semibold text-emerald-600">{payslip.net}</TableCell>
                      <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPayslip(payslip)}
                            >
                              <Eye className="mr-2 h-3.5 w-3.5" /> View Payslip
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center justify-between">
                                <span>Payslip - {selectedPayslip?.month}</span>
                                <Button size="sm" onClick={handlePrint} className="bg-primary">
                                  <Printer className="mr-2 h-4 w-4" /> Download / Print PDF
                                </Button>
                              </DialogTitle>
                              <DialogDescription>Kenzo HRMS Official Salary Statement</DialogDescription>
                            </DialogHeader>

                            {selectedPayslip && (
                              <div className="space-y-6 border rounded-lg p-6 bg-background text-foreground shadow-sm">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b pb-4">
                                  <div>
                                    <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                      <Building2 className="h-5 w-5" /> Kenzo Technologies Inc.
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">100 Enterprise Way, Suite 400, Tech City</p>
                                  </div>
                                  <div className="text-right">
                                    <h4 className="font-bold text-sm">PAYSLIP</h4>
                                    <p className="text-xs font-mono text-muted-foreground">{selectedPayslip.id}</p>
                                    <p className="text-xs font-medium text-emerald-600 mt-1">{selectedPayslip.month}</p>
                                  </div>
                                </div>

                                {/* Employee Info */}
                                <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-3 rounded-md">
                                  <div>
                                    <p><span className="text-muted-foreground">Employee Name:</span> <strong className="text-foreground">Sujal Kumar</strong></p>
                                    <p><span className="text-muted-foreground">Employee Code:</span> <strong>EMP-1001</strong></p>
                                    <p><span className="text-muted-foreground">Designation:</span> <strong>Principal Software Architect</strong></p>
                                  </div>
                                  <div>
                                    <p><span className="text-muted-foreground">Department:</span> <strong>Engineering</strong></p>
                                    <p><span className="text-muted-foreground">Bank Account:</span> <strong>XXXX-XXXX-4892</strong></p>
                                    <p><span className="text-muted-foreground">Payment Date:</span> <strong>{selectedPayslip.date}</strong></p>
                                  </div>
                                </div>

                                {/* Breakdown */}
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                  {/* Earnings */}
                                  <div>
                                    <h5 className="font-semibold border-b pb-1 mb-2 text-emerald-600">Earnings</h5>
                                    <div className="space-y-1.5 text-xs">
                                      <div className="flex justify-between"><span>Basic Salary</span> <span>₹62,500</span></div>
                                      <div className="flex justify-between"><span>House Rent Allowance (HRA)</span> <span>₹31,250</span></div>
                                      <div className="flex justify-between"><span>Special Allowance</span> <span>₹25,000</span></div>
                                      <div className="flex justify-between"><span>Medical Allowance</span> <span>₹6,250</span></div>
                                      <div className="flex justify-between font-semibold border-t pt-1 mt-2"><span>Total Gross Earnings</span> <span>{selectedPayslip.gross}</span></div>
                                    </div>
                                  </div>

                                  {/* Deductions */}
                                  <div>
                                    <h5 className="font-semibold border-b pb-1 mb-2 text-rose-600">Deductions</h5>
                                    <div className="space-y-1.5 text-xs">
                                      <div className="flex justify-between"><span>Provident Fund (PF)</span> <span>₹7,500</span></div>
                                      <div className="flex justify-between"><span>Professional Tax (PT)</span> <span>₹500</span></div>
                                      <div className="flex justify-between"><span>Income Tax (TDS)</span> <span>₹7,000</span></div>
                                      <div className="flex justify-between font-semibold border-t pt-1 mt-2 text-rose-600"><span>Total Deductions</span> <span>{selectedPayslip.deductions}</span></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Net Pay Footer */}
                                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex justify-between items-center">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Net Payable Amount</p>
                                    <p className="text-xl font-bold text-primary">{selectedPayslip.net}</p>
                                  </div>
                                  <Badge className="bg-emerald-600 text-white">Paid via Direct Deposit</Badge>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company-payroll" className="space-y-4">
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Config
            </Button>
            <Button className="bg-primary">
              <PlayCircle className="mr-2 h-4 w-4" /> Run Payroll
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Est. Total Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollStats.totalAmount}</div>
                <p className="text-xs text-muted-foreground mt-1">For current month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollStats.processed}</div>
                <p className="text-xs text-muted-foreground mt-1">Employees processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollStats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollStats.avgSalary}</div>
                <p className="text-xs text-muted-foreground mt-1">Per employee</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Current Cycle: Sep 2023</CardTitle>
                <CardDescription>Pay period: Sep 1 - Sep 30</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Data Validation</span>
                    <span className="text-emerald-600 font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Attendance Sync</span>
                    <span className="text-emerald-600 font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Calculations</span>
                    <span className="text-amber-600 font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Final Approval</span>
                    <span>0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">7 pending anomalies</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Review pending leave requests and overtime logs before final calculation.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Review Anomalies</Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1 md:col-span-4">
              <CardHeader>
                <CardTitle>Company Payroll Runs</CardTitle>
                <CardDescription>Previous payroll cycles and records.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month/Year</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Processed Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.month}</TableCell>
                        <TableCell>{record.amount}</TableCell>
                        <TableCell>{record.employees}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

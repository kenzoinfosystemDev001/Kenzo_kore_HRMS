"use client"

import React from "react"
import { DollarSign, Users, Clock, CheckCircle2, PlayCircle, Download, FileText, Settings, AlertCircle, Eye, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useAuth } from "@/lib/auth"
import { payrollStats, payrollHistory } from "@/features/payroll/data"

const myPayslips: { id: string; month: string; gross: string; deductions: string; net: string; status: string; date: string }[] = []

export default function PayrollPage() {
  const { isAdmin } = useAuth()

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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Payroll & Payslips</h2>
          <p className="text-muted-foreground mt-1">View your monthly payslips, download statements, and manage company payroll.</p>
        </div>
      </div>

      <Tabs defaultValue="my-payslips" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-payslips">My Payslips</TabsTrigger>
          {isAdmin && <TabsTrigger value="company-payroll">Company Payroll (Admin)</TabsTrigger>}
        </TabsList>

        <TabsContent value="my-payslips" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Net Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">—</div>
                <p className="text-xs text-muted-foreground mt-1">No payslips generated yet</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">YTD Gross Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹0</div>
                <p className="text-xs text-muted-foreground mt-1">Financial Year 2026-27</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tax Deducted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹0</div>
                <p className="text-xs text-muted-foreground mt-1">TDS Deposited</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">My Payslip History</CardTitle>
              <CardDescription>Download or print your monthly salary statements.</CardDescription>
            </CardHeader>
            <CardContent>
              {myPayslips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground">No Payslips Generated</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Payslips will appear here once the admin processes the monthly payroll cycle.
                  </p>
                </div>
              ) : (
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
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3.5 w-3.5" /> View Payslip
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
                  <div className="text-2xl font-bold text-foreground">{payrollStats.totalAmount}</div>
                  <p className="text-xs text-muted-foreground mt-1">For current month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{payrollStats.processed}</div>
                  <p className="text-xs text-muted-foreground mt-1">Employees processed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{payrollStats.pending}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{payrollStats.avgSalary}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per employee</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-foreground">Current Cycle: August 2026</CardTitle>
                  <CardDescription>Pay period: Aug 1 - Aug 31</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Data Validation</span>
                      <span className="text-emerald-600 font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Attendance Sync</span>
                      <span className="text-emerald-600 font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Calculations</span>
                      <span className="text-muted-foreground font-medium">Ready</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Final Approval</span>
                      <span>Awaiting</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3 mt-4">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Ready for processing</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">2 employees synced. Click &quot;Run Payroll&quot; to start processing.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Review & Confirm</Button>
                </CardFooter>
              </Card>

              <Card className="col-span-1 md:col-span-4">
                <CardHeader>
                  <CardTitle className="text-foreground">Company Payroll Runs</CardTitle>
                  <CardDescription>Previous payroll cycles and records.</CardDescription>
                </CardHeader>
                <CardContent>
                  {payrollHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-semibold text-foreground">No Payroll History</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Run your first payroll cycle to see history here.
                      </p>
                    </div>
                  ) : (
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
                            <TableCell className="font-medium text-foreground">{record.month}</TableCell>
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
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

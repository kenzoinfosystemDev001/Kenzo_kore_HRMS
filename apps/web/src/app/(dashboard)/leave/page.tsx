import React from "react"
import { CalendarDays, Plus, Check, X, Calendar as CalendarIcon, Clock, Briefcase, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

import { leaveBalances, leaveRequests, leaveTypes, myLeaves } from "@/features/leave/data"

export default function LeaveManagementPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200">Approved</Badge>
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">Pending</Badge>
      case "Rejected":
        return <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Apply Leave
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto w-full justify-start gap-1">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Leave Requests
          </TabsTrigger>
          <TabsTrigger value="myleaves" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            My Leaves
          </TabsTrigger>
          <TabsTrigger value="balances" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Leave Balances
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Leave Calendar
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Leave Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Leave Requests</CardTitle>
              <CardDescription>Review and manage leave applications from your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {req.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{req.employee}</span>
                        </div>
                      </TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell className="text-sm">
                        {req.from} to {req.to}
                      </TableCell>
                      <TableCell>{req.days}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={req.reason}>
                        {req.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right">
                        {req.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">Details</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="myleaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Leave History</CardTitle>
              <CardDescription>Track your past and upcoming leaves.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.type}</TableCell>
                      <TableCell>
                        {leave.from} to {leave.to}
                      </TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>{leave.appliedOn}</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {leaveBalances.map((balance) => {
              const percentage = (balance.used / balance.allocated) * 100;
              return (
                <Card key={balance.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{balance.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{balance.available}</span>
                        <span className="text-sm text-muted-foreground">/ {balance.allocated} days</span>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{balance.used} Used</span>
                          <span>{balance.pending} Pending</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>View upcoming team leaves by month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-lg font-medium">Calendar Visualization</h3>
                  <p className="text-sm text-muted-foreground mt-2">Full calendar component integration pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Configured Leave Types</CardTitle>
                <CardDescription>Company policies for time off.</CardDescription>
              </div>
              <Button size="sm">Add Policy</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Allowance (Days)</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Accrual</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.code}</TableCell>
                      <TableCell>{type.name}</TableCell>
                      <TableCell>{type.days}</TableCell>
                      <TableCell>
                        {type.isPaid ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Paid</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Unpaid</Badge>
                        )}
                      </TableCell>
                      <TableCell>{type.accrual}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

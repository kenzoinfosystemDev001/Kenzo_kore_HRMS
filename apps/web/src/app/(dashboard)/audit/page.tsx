"use client"

import React from "react"
import { ShieldCheck, Search, Download, Lock, Key, UserCheck, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const auditLogs = [
  { id: "AUD-9012", user: "admin@kenzo.com", action: "USER_LOGIN_SUCCESS", entity: "User Session", ip: "192.168.1.111", timestamp: "Aug 05, 2026 15:48:36" },
  { id: "AUD-9013", user: "admin@kenzo.com", action: "PAYROLL_RUN_APPROVED", entity: "PayrollRun (Aug 2026)", ip: "192.168.1.111", timestamp: "Aug 05, 2026 15:30:12" },
  { id: "AUD-9014", user: "hr.manager@kenzo.com", action: "EMPLOYEE_RECORD_UPDATE", entity: "Employee (EMP-1004)", ip: "10.0.4.52", timestamp: "Aug 05, 2026 14:15:00" },
  { id: "AUD-9015", user: "admin@kenzo.com", action: "ROLE_PERMISSIONS_UPDATED", entity: "Role (HR Manager)", ip: "192.168.1.111", timestamp: "Aug 05, 2026 12:00:45" },
]

export default function AuditPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security & Audit Logs</h2>
          <p className="text-muted-foreground mt-1">Immutably track all user actions, authentication events, and data mutations for SOC2 compliance.</p>
        </div>
        <Button className="bg-primary">
          <Download className="mr-2 h-4 w-4" /> Export Audit Log
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
          <CardDescription>Real-time stream of security events across tenant scope.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Audit ID</TableHead>
                <TableHead>Action Event</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Client IP</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

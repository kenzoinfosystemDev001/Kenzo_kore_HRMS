"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Users, Plus, Download, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"

const initialEmployeesList = [
  { id: "EMP-1001", name: "Ankit Sethi", email: "admin@kenzo.com", role: "CEO & Founder", dept: "Management", status: "Active", joinDate: "Jan 01, 2020" },
  { id: "EMP-1002", name: "Sujal Kumar", email: "employee@kenzo.com", role: "Software Architect", dept: "Engineering", status: "Active", joinDate: "Jan 15, 2024" },
]

export default function EmployeesPage() {
  const { isAdmin } = useAuth()
  const [employeesList, setEmployeesList] = useState(initialEmployeesList)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingEmp, setEditingEmp] = useState<typeof initialEmployeesList[0] | null>(null)

  // New Employee Form State
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newDept, setNewDept] = useState("Engineering")
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleDelete = (id: string) => {
    setEmployeesList(employeesList.filter(e => e.id !== id))
  }

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return
    const newEmp = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      email: newEmail,
      role: newRole || "Software Engineer",
      dept: newDept,
      status: "Active",
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }
    setEmployeesList([newEmp, ...employeesList])
    setNewName("")
    setNewEmail("")
    setNewRole("")
    setIsAddOpen(false)
  }

  const handleSaveEdit = () => {
    if (!editingEmp) return
    setEmployeesList(employeesList.map(e => e.id === editingEmp.id ? editingEmp : e))
    setEditingEmp(null)
  }

  const filteredList = employeesList.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Users className="h-3.5 w-3.5" /> Master Employee Directory
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Employee <span className="hero-gradient-text">Management</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Directory of {employeesList.length} active team members</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border text-foreground">
            <Download className="mr-2 h-4 w-4 text-blue-500" /> Export Roster
          </Button>

          {/* Add Employee Dialog - Only shown for admins */}
          {isAdmin && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Employee</DialogTitle>
                  <DialogDescription className="text-muted-foreground">Create a new employee profile in the HRMS system.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label className="text-foreground">Full Name</Label>
                    <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Sarah Connor" required className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Work Email</Label>
                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="sarah.c@kenzo.com" required className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Designation / Role</Label>
                    <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-foreground">Department</Label>
                    <Input value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="Engineering" className="text-foreground" />
                  </div>
                  <Button type="submit" className="w-full">Create Employee</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Active Workforce</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Search employee records by name, ID, or department.</CardDescription>
            </div>
            <Input
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs text-foreground bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-bold text-muted-foreground">EMP ID</TableHead>
                <TableHead className="font-bold text-muted-foreground">Employee</TableHead>
                <TableHead className="font-bold text-muted-foreground">Role & Department</TableHead>
                <TableHead className="font-bold text-muted-foreground">Joining Date</TableHead>
                <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-bold text-muted-foreground">{isAdmin ? 'Admin Actions' : 'View'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/40 border-border">
                  <TableCell className="font-mono text-xs font-semibold text-primary">{emp.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-foreground text-sm">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-foreground text-xs font-medium">{emp.role}</div>
                    <div className="text-[11px] text-muted-foreground">{emp.dept}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{emp.joinDate}</TableCell>
                  <TableCell>
                    <Badge className={emp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/employees/${emp.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {isAdmin && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                            onClick={() => setEditingEmp(emp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                            onClick={() => handleDelete(emp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      {isAdmin && editingEmp && (
        <Dialog open={!!editingEmp} onOpenChange={(open) => !open && setEditingEmp(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Employee Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground">Update details for {editingEmp.name} ({editingEmp.id}).</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-foreground">Full Name</Label>
                <Input className="text-foreground" value={editingEmp.name} onChange={e => setEditingEmp({ ...editingEmp, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Email</Label>
                <Input className="text-foreground" value={editingEmp.email} onChange={e => setEditingEmp({ ...editingEmp, email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Role</Label>
                <Input className="text-foreground" value={editingEmp.role} onChange={e => setEditingEmp({ ...editingEmp, role: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Department</Label>
                <Input className="text-foreground" value={editingEmp.dept} onChange={e => setEditingEmp({ ...editingEmp, dept: e.target.value })} />
              </div>
              <Button onClick={handleSaveEdit} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


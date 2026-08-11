"use client"

import React, { useState } from "react"
import { HeadphonesIcon, MessageSquare, Clock, CheckCircle2, Plus, Trash2 } from "lucide-react"

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
  useHelpdeskTickets,
  addStoredTicket,
  updateTicketStatus,
  deleteStoredTicket,
  HelpdeskTicketRecord,
} from "@/lib/helpdesk-store"
import { addTargetNotification } from "@/lib/notification-store"

export default function HelpdeskPage() {
  const { user, isAdmin } = useAuth()
  const [ticketsList, setTicketsList] = useHelpdeskTickets()
  const [searchTerm, setSearchTerm] = useState("")

  // Raise Ticket Modal State
  const [isRaiseOpen, setIsRaiseOpen] = useState(false)
  const [category, setCategory] = useState<HelpdeskTicketRecord["category"]>("IT & Tools Requirement")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState<HelpdeskTicketRecord["priority"]>("Medium")
  const [description, setDescription] = useState("")

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return

    const newTicket: HelpdeskTicketRecord = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject.trim(),
      category,
      raisedBy: user?.name || "Employee",
      raisedByEmail: user?.email || "employee@kenzoinfosystems.com",
      assignedTo: category.includes("IT") ? "IT Admin" : category.includes("Payroll") ? "HR & Payroll" : "Admin Team",
      priority,
      status: "Open",
      description: description.trim() || "No additional notes provided.",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }

    const updated = addStoredTicket(newTicket)
    setTicketsList(updated)

    // Notify Super Admin / Admin
    addTargetNotification({
      targetEmail: "ankit.sethi@kenzoinfosystems.com",
      title: `🎫 New ${category} Ticket (${newTicket.id})`,
      message: `${user?.name || "Employee"} raised a ${priority} priority ticket: "${subject.trim()}"`,
      type: "HELP",
      date: new Date().toLocaleDateString(),
      isRead: false,
    })

    setSubject("")
    setDescription("")
    setIsRaiseOpen(false)
  }

  const handleStatusChange = (id: string, status: HelpdeskTicketRecord["status"]) => {
    const updated = updateTicketStatus(id, status)
    setTicketsList(updated)

    const target = ticketsList.find(t => t.id === id)
    if (target) {
      addTargetNotification({
        targetEmail: target.raisedByEmail.toLowerCase(),
        title: `🎫 Helpdesk Ticket Update (${target.id})`,
        message: `Your support ticket "${target.subject}" has been updated to "${status}" by Admin.`,
        type: "HELP",
        date: new Date().toLocaleDateString(),
        isRead: false,
      })
    }
  }

  const handleDelete = (id: string) => {
    const updated = deleteStoredTicket(id)
    setTicketsList(updated)
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "Urgent":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-bold">Urgent</Badge>
      case "High":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">High</Badge>
      case "Medium":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold">Medium</Badge>
      default:
        return <Badge variant="outline" className="font-bold">{p}</Badge>
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Open":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold">Open</Badge>
      case "In Progress":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold">In Progress</Badge>
      case "Resolved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">Resolved</Badge>
      case "Closed":
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold">Closed</Badge>
      default:
        return <Badge variant="outline">{s}</Badge>
    }
  }

  // Display tickets based on user role (Admin sees all; Employee sees their own)
  const displayableTickets = isAdmin
    ? ticketsList
    : ticketsList.filter(t => t.raisedByEmail.toLowerCase() === user?.email?.toLowerCase())

  const filtered = displayableTickets.filter(t =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.raisedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openTicketsCount = displayableTickets.filter(t => t.status === "Open" || t.status === "In Progress").length
  const resolvedTicketsCount = displayableTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <HeadphonesIcon className="h-3.5 w-3.5 text-blue-500" /> Internal HR, IT & Finance Support Desk
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Helpdesk & Support Portal</h2>
          <p className="text-muted-foreground text-sm">Raise support tickets, tool requirements, equipment requests, or complaints directly to HR/Admin.</p>
        </div>

        {/* Raise Ticket Button Dialog */}
        <Dialog open={isRaiseOpen} onOpenChange={setIsRaiseOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-xl px-5">
              <Plus className="mr-2 h-4 w-4" /> Raise Support Ticket / Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground font-extrabold">
                <HeadphonesIcon className="h-5 w-5 text-blue-500" /> Submit New Support Ticket
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit a help request, IT tool requirement, hardware issue, or complaint. Admins will be notified instantly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRaiseTicket} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Category / Support Type</Label>
                <Select value={category} onValueChange={(val: HelpdeskTicketRecord["category"]) => setCategory(val)}>
                  <SelectTrigger className="bg-background text-xs font-semibold">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT & Tools Requirement">IT & Tools Requirement</SelectItem>
                    <SelectItem value="Equipment & Hardware">Equipment & Hardware</SelectItem>
                    <SelectItem value="Help/Support">General Help / Support</SelectItem>
                    <SelectItem value="Complaint/Grievance">Complaint / Grievance</SelectItem>
                    <SelectItem value="Payroll & Salary Issue">Payroll & Salary Issue</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-foreground">Ticket Subject</Label>
                  <Input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Need Figma Pro License"
                    required
                    className="text-xs bg-background text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-foreground">Priority Level</Label>
                  <Select value={priority} onValueChange={(val: HelpdeskTicketRecord["priority"]) => setPriority(val)}>
                    <SelectTrigger className="bg-background text-xs font-semibold">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Detailed Requirement / Complaint Notes</Label>
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your requirement, issue, or complaint..."
                  className="text-xs bg-background text-foreground"
                />
              </div>

              <Button type="submit" className="w-full bg-primary font-bold shadow-md">
                Submit Ticket to Admin
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Widgets */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Open Tickets</CardTitle>
            <HeadphonesIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">{openTicketsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Pending HR & IT resolution</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resolved Tickets</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolvedTicketsCount}</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Successfully completed</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SLA Compliance Rate</CardTitle>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground">99.4%</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Same-day response SLA</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee CSAT Rating</CardTitle>
            <MessageSquare className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">4.9 / 5.0</div>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">Based on staff feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {isAdmin ? "Company-Wide Helpdesk Queue" : "My Helpdesk Tickets & Status"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {isAdmin ? "Review, assign, and update employee tickets or complaints." : "Track status updates for your submitted requests."}
              </CardDescription>
            </div>
            <Input
              placeholder="Search ticket, category, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs text-xs bg-background text-foreground"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-2 sm:p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HeadphonesIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-bold text-foreground">No helpdesk tickets found</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;Raise Support Ticket / Complaint&quot; above to submit a request.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-bold text-muted-foreground">Ticket ID</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Subject & Description</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Category</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Raised By</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Priority</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Status</TableHead>
                  <TableHead className="font-bold text-muted-foreground">Date</TableHead>
                  {isAdmin && <TableHead className="text-right font-bold text-muted-foreground">Admin Controls</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ticket) => (
                  <TableRow key={ticket.id} className="border-border">
                    <TableCell className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="font-bold text-foreground text-xs">{ticket.subject}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{ticket.description}</div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{ticket.category}</TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-foreground">{ticket.raisedBy}</div>
                      <div className="text-[10px] text-muted-foreground">{ticket.raisedByEmail}</div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{ticket.createdAt}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select value={ticket.status} onValueChange={(val: HelpdeskTicketRecord["status"]) => handleStatusChange(ticket.id, val)}>
                            <SelectTrigger className="h-8 w-28 text-[10px] font-bold bg-background">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                            onClick={() => handleDelete(ticket.id)}
                            title="Delete Ticket"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

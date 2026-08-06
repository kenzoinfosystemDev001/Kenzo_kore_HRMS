"use client"

import * as React from "react"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { mockEmployee } from "@/features/employees/mock-employee"

export default function EmployeeProfilePage() {
  const [emp, setEmp] = React.useState(mockEmployee)
  const [isEditOpen, setIsEditOpen] = React.useState(false)

  // Editable Form State
  const [firstName, setFirstName] = React.useState(emp.firstName)
  const [lastName, setLastName] = React.useState(emp.lastName)
  const [designation, setDesignation] = React.useState(emp.designation)
  const [department, setDepartment] = React.useState(emp.department)
  const [phone, setPhone] = React.useState(emp.phone)
  const [email, setEmail] = React.useState(emp.email)
  const [location, setLocation] = React.useState(emp.location)
  const [salary, setSalary] = React.useState("₹28,50,000 / year")
  const [manager, setManager] = React.useState(emp.manager)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setEmp({
      ...emp,
      firstName,
      lastName,
      designation,
      department,
      phone,
      email,
      location,
      manager,
    })
    setIsEditOpen(false)
  }

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              Employee 360 Degree Profile
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Profile: <span className="hero-gradient-text">{emp.firstName} {emp.lastName}</span>
            </h2>
          </div>
        </div>

        {/* Edit Profile Modal Trigger */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee 360 Profile</DialogTitle>
              <DialogDescription>Update master records for {emp.firstName} {emp.lastName} ({emp.id}).</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Designation</Label>
                  <Input value={designation} onChange={e => setDesignation(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input value={department} onChange={e => setDepartment(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Work Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label>Phone Number</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Reporting Manager</Label>
                  <Input value={manager} onChange={e => setManager(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Work Location</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Compensation Package</Label>
                <Input value={salary} onChange={e => setSalary(e.target.value)} />
              </div>

              <Button type="submit" className="w-full">Save Profile Updates</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card glass-card">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>
        <div className="px-6 pb-6 pt-0 relative sm:flex sm:items-end sm:space-x-5">
          <div className="relative -mt-16 flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-muted shadow-xl">
            <Avatar className="h-full w-full">
              <AvatarImage src={`https://api.dicebear.com/9.x/notionists/svg?seed=${emp.firstName}`} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {emp.firstName[0]}
                {emp.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">
                {emp.firstName} {emp.lastName}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">{emp.designation} • {emp.department}</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs">
              {emp.status}
            </Badge>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 gap-4 border-t bg-muted/30 p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Employee ID</p>
            <p className="mt-1 font-bold text-foreground">{emp.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Date of Joining</p>
            <p className="mt-1 font-bold text-foreground">{emp.joinDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Reporting Manager</p>
            <p className="mt-1 font-bold text-foreground">{emp.manager}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Work Location</p>
            <p className="mt-1 font-bold text-foreground">{emp.location}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment Details</TabsTrigger>
          <TabsTrigger value="compensation">Compensation & Pay</TabsTrigger>
          <TabsTrigger value="documents">Documents & Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 pt-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Email Address</p>
                <p className="font-bold text-foreground mt-0.5">{emp.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</p>
                <p className="font-bold text-foreground mt-0.5">{emp.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Emergency Contact</p>
                <p className="font-bold text-foreground mt-0.5">Jane Doe (+1 555-0192)</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Blood Group</p>
                <p className="font-bold text-foreground mt-0.5">O+ Positive</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4 pt-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Employment & Job Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
                <p className="font-bold text-foreground mt-0.5">{emp.department}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Designation</p>
                <p className="font-bold text-foreground mt-0.5">{emp.designation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Employment Type</p>
                <p className="font-bold text-foreground mt-0.5">Full-Time Permanent</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Probation Status</p>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 mt-1">Confirmed / Passed</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compensation" className="space-y-4 pt-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Salary & Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Annual CTC Package</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-0.5">{salary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Bank Account</p>
                <p className="font-bold text-foreground mt-0.5">HDFC Bank ••••••4092</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 pt-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Verified Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
                <span className="font-semibold text-xs text-foreground">Employment Agreement & Offer Letter</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Verified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
                <span className="font-semibold text-xs text-foreground">Identity & Passport Proof</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Verified</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

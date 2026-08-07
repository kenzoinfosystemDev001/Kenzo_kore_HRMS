"use client"

import * as React from "react"
import { ArrowLeft, Edit, ShieldCheck, Lock, Save, Camera } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { getStoredEmployees, updateStoredEmployee, EmployeeRecord } from "@/lib/employee-store"

export default function EmployeeProfilePage() {
  const params = useParams()
  const routeId = (params?.id as string) || ""
  const { user, isAdmin } = useAuth()

  const allEmployees = React.useMemo(() => getStoredEmployees(), [])
  
  const initialEmp = React.useMemo(() => {
    if (!routeId) return allEmployees[0]
    return allEmployees.find(e => e.id.toLowerCase() === routeId.toLowerCase() || e.email.toLowerCase() === routeId.toLowerCase()) || allEmployees[0]
  }, [allEmployees, routeId])

  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<EmployeeRecord>>(initialEmp || {})

  const emp = initialEmp

  if (!emp) return null

  // Security Check: Only Admin OR the specific employee themselves can view/edit confidential fields
  const isSelf = user?.email?.toLowerCase() === emp.email.toLowerCase()
  const canAccessConfidential = isAdmin || isSelf

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emp) return
    const updated: EmployeeRecord = {
      ...emp,
      ...formData,
    }
    updateStoredEmployee(updated, emp.id)
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
              <ShieldCheck className="h-3.5 w-3.5" /> Employee 360° Confidential Profile
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Profile: <span className="hero-gradient-text">{emp.name}</span>
            </h2>
          </div>
        </div>

        {/* Edit Profile Modal Trigger - Allowed for Admin OR Account Owner */}
        {canAccessConfidential && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Confidential Master Profile</DialogTitle>
                <DialogDescription>Update employee records for {emp.name} ({emp.id}). Access authorized for HR Admin & Employee.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                {/* Profile Picture Upload Section */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <Label className="text-foreground font-bold flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" /> Profile Picture (Avatar)
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/40 shadow-sm">
                      <AvatarImage src={formData.avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${formData.name || emp.name}`} />
                      <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                        {(formData.name || emp.name)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2 w-full">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="text-xs bg-background cursor-pointer"
                      />
                      <Input 
                        type="url" 
                        value={formData.avatarUrl || ""} 
                        onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })} 
                        placeholder="Or paste image URL (https://...)" 
                        className="text-xs bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>EMP_ID (Employee Code)</Label>
                    <Input 
                      value={formData.id || ""} 
                      onChange={e => setFormData({ ...formData, id: e.target.value })} 
                      disabled={!isAdmin} 
                      className={!isAdmin ? "bg-muted" : "font-mono font-bold text-primary"} 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Joining Date</Label>
                    <Input 
                      value={formData.joinDate || ""} 
                      onChange={e => setFormData({ ...formData, joinDate: e.target.value })} 
                      disabled={!isAdmin} 
                      placeholder="e.g. Jan 15, 2024" 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Current Address</Label>
                    <Input value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Permanent Address</Label>
                    <Input value={formData.permanentAddress || ""} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} placeholder="" />
                  </div>

                  <div className="space-y-1">
                    <Label>Primary Phone Number</Label>
                    <Input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Emergency Contact Number</Label>
                    <Input value={formData.emergencyPhone || ""} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} placeholder="" />
                  </div>

                  <div className="space-y-1">
                    <Label>Personal Mail</Label>
                    <Input type="email" value={formData.personalEmail || ""} onChange={e => setFormData({ ...formData, personalEmail: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Govt ID Type</Label>
                    <Select value={formData.govtIdType || ""} onValueChange={v => setFormData({ ...formData, govtIdType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adhaar">Adhaar</SelectItem>
                        <SelectItem value="PAN">PAN Card</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Govt ID Value</Label>
                    <Input value={formData.govtIdValue || ""} onChange={e => setFormData({ ...formData, govtIdValue: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Marital Status</Label>
                    <Select value={formData.maritalStatus || ""} onValueChange={v => setFormData({ ...formData, maritalStatus: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Dependent Nominee Name</Label>
                    <Input value={formData.dependentNominee || ""} onChange={e => setFormData({ ...formData, dependentNominee: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Dependent Nominee DOB</Label>
                    <Input type="date" value={formData.dependentNomineeDob || ""} onChange={e => setFormData({ ...formData, dependentNomineeDob: e.target.value })} />
                  </div>

                  <div className="space-y-1">
                    <Label>Highest Qualification</Label>
                    <Input value={formData.qualification || ""} onChange={e => setFormData({ ...formData, qualification: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Score Card / Rating</Label>
                    <Input value={formData.scoreCard || ""} onChange={e => setFormData({ ...formData, scoreCard: e.target.value })} placeholder="" />
                  </div>

                  <div className="space-y-1">
                    <Label>Medical Issues</Label>
                    <Input value={formData.medicalIssues || ""} onChange={e => setFormData({ ...formData, medicalIssues: e.target.value })} placeholder="" />
                  </div>
                  <div className="space-y-1">
                    <Label>Medication</Label>
                    <Input value={formData.medication || ""} onChange={e => setFormData({ ...formData, medication: e.target.value })} placeholder="" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Medical History Notes</Label>
                  <textarea className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={formData.medicalHistory || ""} onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })} placeholder="" />
                </div>

                <div className="space-y-1">
                  <Label>Documents & Verification Record Link</Label>
                  <Input value={formData.documents || ""} onChange={e => setFormData({ ...formData, documents: e.target.value })} placeholder="" />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
                  <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Header Banner */}
      <div className="overflow-hidden rounded-2xl border bg-card glass-card">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>
        <div className="px-6 pb-6 pt-0 relative sm:flex sm:items-end sm:space-x-5">
          <div className="relative -mt-16 flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-muted shadow-xl group overflow-hidden">
            <Avatar className="h-full w-full">
              <AvatarImage src={emp.avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${emp.name}`} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {emp.name.split(" ")[0]?.[0]}
                {emp.name.split(" ")[1]?.[0]}
              </AvatarFallback>
            </Avatar>

            {canAccessConfidential && (
              <button 
                onClick={() => setIsEditOpen(true)} 
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200"
                title="Upload or Change Profile Picture"
              >
                <Camera className="h-6 w-6" />
                <span className="text-[10px] font-bold mt-0.5">Upload</span>
              </button>
            )}
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">{emp.name}</h1>
              <p className="text-muted-foreground text-sm font-medium">{emp.role} • {emp.dept}</p>
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
            <p className="text-xs font-semibold text-muted-foreground uppercase">Work Email</p>
            <p className="mt-1 font-bold text-foreground">{emp.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
            <p className="mt-1 font-bold text-foreground">{emp.dept}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Date of Joining</p>
            <p className="mt-1 font-bold text-foreground">{emp.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="confidential" className="w-full">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="confidential">Confidential Personal Record</TabsTrigger>
          <TabsTrigger value="medical">Medical & Nominee Details</TabsTrigger>
          <TabsTrigger value="qualification">Qualifications & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="confidential" className="space-y-4 pt-2">
          {!canAccessConfidential ? (
            <Card className="glass-card border-rose-500/30 bg-rose-500/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="h-12 w-12 text-rose-500 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Confidential Employee Profile</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Personal address, government IDs, nominee details, and emergency contacts are restricted. Only the account owner ({emp.name}) and HR Admin can view this record.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Confidential Identity & Contact Information</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Authorized View (Admin / Employee Owner)</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Primary Address</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.address || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Permanent Address</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.permanentAddress || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Primary Phone Number</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.phone || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Emergency Contact Number</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.emergencyPhone || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Personal Email</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.personalEmail || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Marital Status</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.maritalStatus || "Single"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Govt ID Type & Value</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.govtIdType || "Adhaar"}: {emp.govtIdValue || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Account Status</p>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Verified Active</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 pt-2">
          {!canAccessConfidential ? (
            <Card className="glass-card border-rose-500/30 bg-rose-500/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="h-12 w-12 text-rose-500 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Restricted Medical & Family Data</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Nominee details and medical history are protected under HIPAA/GDPR privacy rules.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Medical Records & Nominee Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Dependent Nominee Name</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.dependentNominee || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Nominee DOB</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.dependentNomineeDob || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medical Issues</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.medicalIssues || "None"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medication</p>
                  <p className="font-bold text-foreground mt-0.5">{emp.medication || "None"}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medical History Notes</p>
                  <p className="font-medium text-foreground mt-1 p-3 border rounded-xl bg-muted/20">{emp.medicalHistory || "No surgeries or chronic conditions recorded."}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="qualification" className="space-y-4 pt-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Qualifications & Document Verification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Highest Qualification</p>
                <p className="font-bold text-foreground mt-0.5">{emp.qualification || "B.Tech Computer Science"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Score Card / Rating</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{emp.scoreCard || "Performance Rating (95/100)"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Verification Records & Documents</p>
                <p className="font-medium text-foreground mt-1 p-3 border rounded-xl bg-muted/20">{emp.documents || "Verified Records On File"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

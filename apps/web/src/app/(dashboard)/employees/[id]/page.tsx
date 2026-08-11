/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { 
  ArrowLeft, 
  Edit, 
  ShieldCheck, 
  Lock, 
  Save, 
  Camera, 
  Upload, 
  FileCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Eye, 
  Download,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth"
import { useEmployees, useUpdateEmployee } from "@/lib/hooks/use-employees"
import { 
  EmployeeRecord, 
  VERIFICATION_DOCUMENTS_LIST, 
  UploadedDocRecord 
} from "@/lib/employee-store"

export default function EmployeeProfilePage() {
  const params = useParams()
  const routeId = (params?.id as string) || ""
  const { user, isAdmin } = useAuth()

  const { data: employeesList = [] } = useEmployees()
  const updateMutation = useUpdateEmployee()
  
  const currentEmp = React.useMemo(() => {
    const decodedRoute = routeId ? decodeURIComponent(routeId).toLowerCase() : ""

    if (decodedRoute) {
      const match = employeesList.find(e => 
        e.id.toLowerCase() === decodedRoute || 
        e.email.toLowerCase() === decodedRoute
      )
      if (match) return match
    }

    if (user?.email) {
      const matchUser = employeesList.find(e => e.email.toLowerCase() === user.email.toLowerCase() || e.id.toLowerCase() === user.id?.toLowerCase())
      if (matchUser) return matchUser
    }

    return employeesList[0]
  }, [employeesList, routeId, user])

  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<EmployeeRecord>>({})
  const [previewDocUrl, setPreviewDocUrl] = React.useState<{ name: string; url: string } | null>(null)

  const handleOpenEditDialog = (open: boolean) => {
    setIsEditOpen(open)
    if (open && currentEmp) {
      setFormData(currentEmp)
    }
  }

  if (!currentEmp) return null

  // Security Check: Admin OR the employee themselves can view/edit profile and upload documents
  const isSelf = user?.email?.toLowerCase() === currentEmp.email.toLowerCase()
  const canAccessConfidential = isAdmin || isSelf

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEmp) return
    try {
      await updateMutation.mutateAsync({
        id: currentEmp.id,
        data: formData,
      })
      setIsEditOpen(false)
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to update profile on server")
    }
  }

  // Handle Document File Upload
  const handleFileUpload = (docId: string, file: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const fileUrl = reader.result as string
      const nowStr = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      
      const newDocRecord: UploadedDocRecord = {
        fileName: file.name,
        fileUrl: fileUrl,
        uploadedAt: nowStr,
        status: "Uploaded",
      }

      const existingUploaded = currentEmp.uploadedDocuments || {}
      const updatedDocs = { ...existingUploaded, [docId]: newDocRecord }

      const updatedEmp: EmployeeRecord = {
        ...currentEmp,
        uploadedDocuments: updatedDocs,
      }

      await updateMutation.mutateAsync({
        id: currentEmp.id,
        data: updatedEmp,
      })
    }
    reader.readAsDataURL(file)
  }

  // Handle Document Deletion
  const handleDeleteDoc = async (docId: string) => {
    const existingUploaded = { ...(currentEmp.uploadedDocuments || {}) }
    delete existingUploaded[docId]

    const updatedEmp: EmployeeRecord = {
      ...currentEmp,
      uploadedDocuments: existingUploaded,
    }

    await updateMutation.mutateAsync({
      id: currentEmp.id,
      data: updatedEmp,
    })
  }

  // Calculate Verification Progress
  const uploadedDocs = currentEmp.uploadedDocuments || {}
  const mandatoryDocs = VERIFICATION_DOCUMENTS_LIST.filter(d => d.mandatory)
  const uploadedMandatoryCount = mandatoryDocs.filter(d => uploadedDocs[d.id]?.fileUrl).length
  const mandatoryProgressPct = Math.round((uploadedMandatoryCount / mandatoryDocs.length) * 100)

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Employee 360° Confidential Profile & Onboarding
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Profile: <span className="hero-gradient-text">{currentEmp.name}</span>
            </h2>
          </div>
        </div>

        {/* Edit Profile Modal Trigger (Allowed for Admin OR Employee Self-Service) */}
        {canAccessConfidential && (
          <Dialog open={isEditOpen} onOpenChange={handleOpenEditDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground font-extrabold">
                  <Edit className="h-5 w-5 text-blue-500" /> Edit Employee Personal Profile & Records
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update employee details for {currentEmp.name} ({currentEmp.id}). Employees can edit all personal and contact details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                {/* Profile Picture Section */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <Label className="text-foreground font-bold flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" /> Profile Picture Avatar
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/40 shadow-sm">
                      <AvatarImage src={formData.avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${formData.name || currentEmp.name}`} />
                      <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                        {(formData.name || currentEmp.name)[0]}
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
                    <Label className="font-bold">Full Name</Label>
                    <Input value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold">Employee ID (EMP ID)</Label>
                    <Input 
                      value={formData.id || ""} 
                      onChange={e => setFormData({ ...formData, id: e.target.value })} 
                      disabled={!isAdmin} 
                      className={!isAdmin ? "bg-muted cursor-not-allowed" : "font-mono font-bold text-primary"} 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Date of Joining</Label>
                    <Input 
                      value={formData.joinDate || ""} 
                      onChange={e => setFormData({ ...formData, joinDate: e.target.value })} 
                      disabled={!isAdmin} 
                      className={!isAdmin ? "bg-muted cursor-not-allowed" : ""} 
                      placeholder="e.g. Jan 15, 2024" 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Work Email</Label>
                    <Input type="email" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!isAdmin} className={!isAdmin ? "bg-muted cursor-not-allowed" : ""} />
                  </div>

                  <div className="space-y-1">
                    <Label>Primary Phone Number</Label>
                    <Input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98100 12345" />
                  </div>
                  <div className="space-y-1">
                    <Label>Emergency Contact Number</Label>
                    <Input value={formData.emergencyPhone || ""} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} placeholder="+91 98351 23735" />
                  </div>

                  <div className="space-y-1">
                    <Label>Personal Email</Label>
                    <Input type="email" value={formData.personalEmail || ""} onChange={e => setFormData({ ...formData, personalEmail: e.target.value })} placeholder="personal@example.com" />
                  </div>
                  <div className="space-y-1">
                    <Label>Marital Status</Label>
                    <Select value={formData.maritalStatus || "Single"} onValueChange={v => setFormData({ ...formData, maritalStatus: v })}>
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
                    <Label>Current / Local Address</Label>
                    <Input value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Flat, Street, City, Pincode" />
                  </div>
                  <div className="space-y-1">
                    <Label>Permanent Home Address</Label>
                    <Input value={formData.permanentAddress || ""} onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })} placeholder="Village/Town, District, State, Pincode" />
                  </div>

                  <div className="space-y-1">
                    <Label>Govt ID Type</Label>
                    <Select value={formData.govtIdType || "Aadhaar"} onValueChange={v => setFormData({ ...formData, govtIdType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                        <SelectItem value="PAN">PAN Card</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Govt ID Number</Label>
                    <Input value={formData.govtIdValue || ""} onChange={e => setFormData({ ...formData, govtIdValue: e.target.value })} placeholder="e.g. 5917 3041 2902" />
                  </div>

                  <div className="space-y-1">
                    <Label>Dependent Nominee Name</Label>
                    <Input value={formData.dependentNominee || ""} onChange={e => setFormData({ ...formData, dependentNominee: e.target.value })} placeholder="Nominee Full Name" />
                  </div>
                  <div className="space-y-1">
                    <Label>Dependent Nominee Date of Birth</Label>
                    <Input type="date" value={formData.dependentNomineeDob || ""} onChange={e => setFormData({ ...formData, dependentNomineeDob: e.target.value })} />
                  </div>

                  <div className="space-y-1">
                    <Label>Highest Educational Qualification</Label>
                    <Input value={formData.qualification || ""} onChange={e => setFormData({ ...formData, qualification: e.target.value })} placeholder="e.g. B.Tech / MBA / MCA" />
                  </div>
                  <div className="space-y-1">
                    <Label>Score Card / Performance Rating</Label>
                    <Input value={formData.scoreCard || ""} onChange={e => setFormData({ ...formData, scoreCard: e.target.value })} placeholder="e.g. 95/100 Rating" />
                  </div>

                  <div className="space-y-1">
                    <Label>Medical Issues / Allergies</Label>
                    <Input value={formData.medicalIssues || ""} onChange={e => setFormData({ ...formData, medicalIssues: e.target.value })} placeholder="None or details" />
                  </div>
                  <div className="space-y-1">
                    <Label>Medication / Daily Prescription</Label>
                    <Input value={formData.medication || ""} onChange={e => setFormData({ ...formData, medication: e.target.value })} placeholder="None or details" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Medical History Notes</Label>
                  <textarea 
                    className="flex min-h-[70px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                    value={formData.medicalHistory || ""} 
                    onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })} 
                    placeholder="Annual health checkup clear, no surgeries" 
                  />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold">
                  <Save className="mr-2 h-4 w-4" /> Save Profile Details
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Header Profile Card */}
      <div className="overflow-hidden rounded-2xl border bg-card glass-card">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500"></div>
        <div className="px-6 pb-6 pt-0 relative sm:flex sm:items-end sm:space-x-5">
          <div className="relative -mt-16 flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-muted shadow-xl group overflow-hidden">
            <Avatar className="h-full w-full">
              <AvatarImage src={currentEmp.avatarUrl || `https://api.dicebear.com/9.x/notionists/svg?seed=${currentEmp.name}`} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {currentEmp.name.split(" ")[0]?.[0]}
                {currentEmp.name.split(" ")[1]?.[0]}
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
              <h1 className="text-2xl font-extrabold text-foreground">{currentEmp.name}</h1>
              <p className="text-muted-foreground text-sm font-medium">{currentEmp.role} • {currentEmp.dept}</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-4 py-1 text-xs font-bold">
              {currentEmp.status}
            </Badge>
          </div>
        </div>

        {/* Quick Info Summary Bar */}
        <div className="grid grid-cols-2 gap-4 border-t bg-muted/30 p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Employee ID</p>
            <p className="mt-1 font-bold text-foreground font-mono">{currentEmp.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Work Email</p>
            <p className="mt-1 font-bold text-foreground">{currentEmp.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Department</p>
            <p className="mt-1 font-bold text-foreground">{currentEmp.dept}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Date of Joining</p>
            <p className="mt-1 font-bold text-foreground">{currentEmp.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Verification Formalities Progress Banner */}
      <Card className="glass-card border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-500" /> Verification Documents & Onboarding Formalities
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Mandatory document verification status for employee onboarding and compliance audit.
              </CardDescription>
            </div>
            <Badge className={mandatoryProgressPct === 100 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-extrabold px-3.5 py-1 text-xs" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-extrabold px-3.5 py-1 text-xs"}>
              {uploadedMandatoryCount} / {mandatoryDocs.length} Mandatory Docs Uploaded ({mandatoryProgressPct}%)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={mandatoryProgressPct} className="h-2.5 w-full bg-muted" />
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="documents" className="w-full space-y-4">
        <TabsList className="bg-card border p-1 rounded-xl">
          <TabsTrigger value="documents" className="font-bold flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-blue-500" /> Upload Verification Documents ({Object.keys(uploadedDocs).length} / 15)
          </TabsTrigger>
          <TabsTrigger value="confidential" className="font-bold">Confidential Personal Record</TabsTrigger>
          <TabsTrigger value="medical" className="font-bold">Medical & Nominee Details</TabsTrigger>
          <TabsTrigger value="qualification" className="font-bold">Educational Qualifications</TabsTrigger>
        </TabsList>

        {/* Tab 1: Upload Verification Documents (15 Required Items with Mandatory ** Tags) */}
        <TabsContent value="documents" className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-blue-500" /> Onboarding Formalities Document Repository
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Kindly upload the following 15 documents for verification. Items marked with <span className="font-bold text-rose-500">**</span> are mandatory.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {VERIFICATION_DOCUMENTS_LIST.map((doc, idx) => {
                const uploaded = uploadedDocs[doc.id]
                return (
                  <div key={doc.id} className="p-4 rounded-xl border bg-background/50 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-muted-foreground font-mono">{idx + 1}.</span>
                        <h4 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                          {doc.title}
                          {doc.mandatory && (
                            <span className="text-rose-500 font-extrabold text-sm" title="Mandatory Requirement">**</span>
                          )}
                        </h4>
                        {doc.mandatory ? (
                          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] font-bold py-0 px-2">
                            Mandatory**
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {uploaded ? (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                            </span>
                            <span className="text-[10px] text-muted-foreground max-w-[150px] truncate" title={uploaded.fileName}>
                              {uploaded.fileName}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-bold text-blue-600 hover:text-blue-700"
                            onClick={() => setPreviewDocUrl({ name: uploaded.fileName, url: uploaded.fileUrl })}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" /> Preview
                          </Button>

                          {canAccessConfidential && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-500/10"
                              title="Delete File"
                              onClick={() => handleDeleteDoc(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> Pending
                          </span>

                          {canAccessConfidential && (
                            <label className="cursor-pointer">
                              <Input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleFileUpload(doc.id, file)
                                }}
                              />
                              <span className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1.5 text-xs shadow-sm">
                                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload File
                              </span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Confidential Personal Record */}
        <TabsContent value="confidential" className="space-y-4">
          {!canAccessConfidential ? (
            <Card className="glass-card border-rose-500/30 bg-rose-500/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="h-12 w-12 text-rose-500 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Confidential Employee Profile</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Personal address, government IDs, nominee details, and emergency contacts are restricted. Only the account owner ({currentEmp.name}) and HR Admin can view this record.
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
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Current Address</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.address || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Permanent Address</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.permanentAddress || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Primary Phone Number</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.phone || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Emergency Contact Number</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.emergencyPhone || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Personal Email</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.personalEmail || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Marital Status</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.maritalStatus || "Single"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Govt ID Type & Value</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.govtIdType || "Adhaar"}: {currentEmp.govtIdValue || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Account Status</p>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Verified Active</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Medical & Nominee Details */}
        <TabsContent value="medical" className="space-y-4">
          {!canAccessConfidential ? (
            <Card className="glass-card border-rose-500/30 bg-rose-500/5">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="h-12 w-12 text-rose-500 mb-3" />
                <h3 className="text-lg font-bold text-foreground">Restricted Medical & Family Data</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Nominee details and medical history are protected under privacy guidelines.
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
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.dependentNominee || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Nominee DOB</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.dependentNomineeDob || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medical Issues</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.medicalIssues || "None"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medication</p>
                  <p className="font-bold text-foreground mt-0.5">{currentEmp.medication || "None"}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Medical History Notes</p>
                  <p className="font-medium text-foreground mt-1 p-3 border rounded-xl bg-muted/20">{currentEmp.medicalHistory || "No surgeries or chronic conditions recorded."}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 4: Educational Qualifications */}
        <TabsContent value="qualification" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Educational Qualifications & Scorecards</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Highest Qualification</p>
                <p className="font-bold text-foreground mt-0.5">{currentEmp.qualification || "B.Tech Computer Science"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Score Card / Rating</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{currentEmp.scoreCard || "Performance Rating (95/100)"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Preview Modal */}
      {previewDocUrl && (
        <Dialog open={!!previewDocUrl} onOpenChange={() => setPreviewDocUrl(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-bold">
                <FileText className="h-5 w-5 text-blue-500" /> Document Preview: {previewDocUrl.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4 border rounded-xl bg-muted/20 min-h-[300px] flex items-center justify-center">
              {previewDocUrl.url.startsWith("data:image/") ? (
                <img src={previewDocUrl.url} alt={previewDocUrl.name} className="max-h-[450px] object-contain rounded-lg shadow-md" />
              ) : (
                <div className="text-center space-y-3">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto" />
                  <p className="text-sm font-bold">{previewDocUrl.name}</p>
                  <p className="text-xs text-muted-foreground">Document file loaded. Click below to download or view in browser.</p>
                  <a 
                    href={previewDocUrl.url} 
                    download={previewDocUrl.name} 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
                  >
                    <Download className="h-4 w-4" /> Download File
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

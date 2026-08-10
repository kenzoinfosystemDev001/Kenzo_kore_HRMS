"use client"

import React from "react"
import { Settings, Building, Shield, Bell, Blocks, Clock, Calendar, Wallet, Plus, Save, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const roles = [
  { id: "r-1", name: "Super Admin", users: 1, description: "Full access to all system features." },
  { id: "r-5", name: "Employee", users: 1, description: "Default role with basic self-service access." },
]

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
      </div>

      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-6 mt-6">
        <TabsList className="flex md:flex-col h-auto w-full md:w-64 items-start justify-start p-1 bg-transparent border md:border-r-0 md:rounded-r-none space-y-1 overflow-x-auto">
          <TabsTrigger value="general" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Settings className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="company" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Building className="mr-2 h-4 w-4" /> Company Profile
          </TabsTrigger>
          <TabsTrigger value="roles" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Shield className="mr-2 h-4 w-4" /> Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="leave" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Calendar className="mr-2 h-4 w-4" /> Leave Policies
          </TabsTrigger>
          <TabsTrigger value="attendance" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Clock className="mr-2 h-4 w-4" /> Attendance Rules
          </TabsTrigger>
          <TabsTrigger value="payroll" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Wallet className="mr-2 h-4 w-4" /> Payroll Setup
          </TabsTrigger>
          <TabsTrigger value="integrations" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Blocks className="mr-2 h-4 w-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="general" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic application settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">System Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="uk">English (UK)</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="ist">India Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateformat">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="dateformat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to system for routine maintenance.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your organization&apos;s core information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Kenzo Infosystems Pvt. Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Legal Name</Label>
                    <Input id="legalName" defaultValue="Kenzo Infosystems Pvt. Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Information Technology" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNo">Registration Number</Label>
                    <Input id="registrationNo" defaultValue="KEN-893-2018" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" defaultValue="sales@kenzoinfosystems.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" type="tel" defaultValue="9999740587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsApp">WhatsApp Support</Label>
                    <Input id="whatsApp" type="tel" defaultValue="8810531196" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Official Corporate Website (Click to Visit)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="website" defaultValue="https://kenzoinfosystems.com/" readOnly className="font-bold text-blue-600 dark:text-blue-400 bg-muted/40" />
                    <Button asChild variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold shrink-0">
                      <a href="https://kenzoinfosystems.com/" target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4 text-blue-500" /> Visit Website
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Registered Address</Label>
                  <Input id="address" defaultValue="Kenzo - 32–C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI – 110091" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Save className="mr-2 h-4 w-4" /> Update Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="m-0 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>Manage system access levels.</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Role
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell className="text-muted-foreground">{role.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{role.users}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholders for other tabs to keep UI robust */}
          <TabsContent value="leave" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Leave Policies</CardTitle>
                <CardDescription>Configure rules, accruals, and approvals.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mt-4 mx-4 mb-4">
                Policy configuration module
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rules</CardTitle>
                <CardDescription>Configure shifts, grace periods, and tracking.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mt-4 mx-4 mb-4">
                Attendance configuration module
              </CardContent>
            </Card>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}

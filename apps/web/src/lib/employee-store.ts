"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export type SystemAccessRole = "Employee" | "Super_admin" | "Admin" | "HR"

export interface UploadedDocRecord {
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: "Uploaded" | "Verified" | "Rejected"
}

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  password?: string
  role: string
  systemRole?: SystemAccessRole
  dept: string
  status: string
  joinDate: string
  avatarUrl?: string
  phone?: string
  address?: string
  permanentAddress?: string
  emergencyPhone?: string
  personalEmail?: string
  govtIdType?: string
  govtIdValue?: string
  maritalStatus?: string
  dependentNominee?: string
  dependentNomineeDob?: string
  qualification?: string
  scoreCard?: string
  medicalIssues?: string
  medication?: string
  medicalHistory?: string
  documents?: string
  uploadedDocuments?: Record<string, UploadedDocRecord>
}

export interface VerificationDocSpec {
  id: string
  title: string
  mandatory: boolean
  description: string
}

export const VERIFICATION_DOCUMENTS_LIST: VerificationDocSpec[] = [
  { id: "aadhaar_card", title: "Aadhaar Card (Original + Photocopy)", mandatory: true, description: "Clear front & back copy of Govt Aadhaar ID" },
  { id: "pan_card", title: "PAN Card (Original + Photocopy)", mandatory: true, description: "Official Income Tax PAN Card copy" },
  { id: "perm_address_proof", title: "Permanent Address Proof", mandatory: true, description: "Passport, Electricity Bill, Voter ID, or Driving License" },
  { id: "temp_address_proof", title: "Current/Temporary Address Proof", mandatory: false, description: "Rent agreement or utility bill (if different from permanent address)" },
  { id: "class_10th_cert", title: "Class 10th Mark Sheet/Certificate", mandatory: true, description: "SSLC / Secondary School Board Certificate" },
  { id: "class_12th_cert", title: "Class 12th Mark Sheet/Certificate", mandatory: true, description: "HSC / Senior Secondary School Certificate" },
  { id: "grad_marksheet", title: "Graduation Mark Sheets (all years/semesters)", mandatory: true, description: "All semester/yearly mark sheets" },
  { id: "grad_degree", title: "Graduation Degree Certificate", mandatory: false, description: "Final Degree or Provisional Certificate (if available)" },
  { id: "passport_photos", title: "Two recent passport-size photographs", mandatory: false, description: "Recent passport photos with white background" },
  { id: "cancelled_cheque", title: "Cancelled Cheque / Bank Passbook", mandatory: false, description: "Showing Account Holder Name, Account #, and IFSC Code" },
  { id: "offer_letters", title: "Offer Letter(s) from previous employer(s)", mandatory: false, description: "Official appointment/offer letters" },
  { id: "experience_letters", title: "Experience Letter(s) from previous employer(s)", mandatory: false, description: "Official work experience letters" },
  { id: "relieving_letter", title: "Relieving Letter from previous employer", mandatory: false, description: "Formal relieving letter from last company" },
  { id: "salary_slips", title: "Last 3 Salary Slips", mandatory: false, description: "Payslips for previous 3 consecutive months" },
  { id: "updated_resume", title: "Updated Resume", mandatory: false, description: "Latest CV/Resume in PDF/DOCX format" },
]

export const DEFAULT_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "EMP-1001",
    name: "Ankit Sethi",
    email: "Ankit.sethi@kenzoinfosystems.com",
    role: "CEO & Founder",
    systemRole: "Super_admin",
    dept: "Management",
    status: "Active",
    joinDate: "Jan 01, 2020",
    phone: "+91 98100 12345",
  },
  {
    id: "EMP-1002",
    name: "Sujal Kumar",
    email: "Sujal.kumar@kenzoinfosystems.com",
    role: "Software Engineer",
    systemRole: "Employee",
    dept: "Engineering",
    status: "Active",
    joinDate: "Jan 15, 2024",
    phone: "6207210784",
  },
  {
    id: "EMP-1003",
    name: "Chanchal Saini",
    email: "Chanchal.saini@kenzoinfosystems.com",
    role: "Managing Director",
    systemRole: "Admin",
    dept: "Administration",
    status: "Active",
    joinDate: "Aug 07, 2026",
    phone: "+91 98100 99887",
  },
  {
    id: "EMP-1004",
    name: "Jitender Saini",
    email: "Jitender.saini@kenzoinfosystems.com",
    role: "CEO",
    systemRole: "Super_admin",
    dept: "Administration",
    status: "Active",
    joinDate: "Aug 07, 2026",
    phone: "+91 98100 77665",
  },
  {
    id: "EMP-1005",
    name: "Laxmi Narayan",
    email: "Laxminarayan.ojha@kenzoinfosystems.com",
    role: "Field Sales Executive",
    systemRole: "Employee",
    dept: "Sales",
    status: "Active",
    joinDate: "Aug 06, 2026",
    phone: "+91 98100 33221",
  },
]

let inMemoryEmployeesCache: EmployeeRecord[] = DEFAULT_EMPLOYEES
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchEmployeesFromApi(): Promise<EmployeeRecord[]> {
  try {
    const raw = await apiClient.get<Record<string, unknown>[] >('/employees')
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped: EmployeeRecord[] = (raw as Record<string, unknown>[]).map(e => {
        const dept = (e.department as Record<string, unknown>) || {}
        const desig = (e.designation as Record<string, unknown>) || {}
        const u = (e.user as Record<string, unknown>) || {}
        const uRoles = (u.userRoles as Record<string, unknown>[]) || []
        const rObj = (uRoles[0]?.role as Record<string, unknown>) || {}

        return {
          id: String(e.employeeCode || e.id || ''),
          name: `${String(e.firstName || '')} ${String(e.lastName || '')}`.trim() || 'Employee',
          email: String(e.workEmail || ''),
          role: String(desig.name || 'Employee'),
          systemRole: (rObj.name || 'Employee') as SystemAccessRole,
          dept: String(dept.name || 'General'),
          status: e.employmentStatus === 'active' || e.employmentStatus === 'Active' ? 'Active' : String(e.employmentStatus || 'Active'),
          joinDate: e.dateOfJoining ? new Date(String(e.dateOfJoining)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Jan 01, 2024',
          phone: String(e.phone || ''),
        }
      })
      inMemoryEmployeesCache = mapped
      notifyListeners()
      return mapped
    }
  } catch (err) {
    console.warn("Error fetching employees from Neon DB API:", err)
  }
  return inMemoryEmployeesCache
}

export function getStoredEmployees(): EmployeeRecord[] {
  return inMemoryEmployeesCache
}

export function saveStoredEmployees(list: EmployeeRecord[]) {
  inMemoryEmployeesCache = list
  notifyListeners()
}

export async function addStoredEmployee(emp: Partial<EmployeeRecord>): Promise<EmployeeRecord[]> {
  try {
    const nameParts = (emp.name || '').split(' ')
    const firstName = nameParts[0] || 'New'
    const lastName = nameParts.slice(1).join(' ') || 'Employee'

    await apiClient.post('/employees', {
      firstName,
      lastName,
      email: emp.email,
      password: emp.password,
      phone: emp.phone,
      employmentType: emp.status || 'Active',
      systemRole: emp.systemRole || 'Employee',
    })
    return await fetchEmployeesFromApi()
  } catch (err) {
    console.warn("Failed to create employee on Neon DB API:", err)
    return inMemoryEmployeesCache
  }
}

export async function updateStoredEmployee(emp: Partial<EmployeeRecord>, oldId?: string): Promise<EmployeeRecord[]> {
  try {
    const targetId = oldId || emp.id
    if (targetId) {
      const nameParts = (emp.name || '').split(' ')
      await apiClient.patch(`/employees/${targetId}`, {
        firstName: nameParts[0] || emp.name,
        lastName: nameParts.slice(1).join(' ') || '',
        phone: emp.phone,
        employmentType: emp.status,
      })
    }
    return await fetchEmployeesFromApi()
  } catch (err) {
    console.warn("Failed to update employee on Neon DB API:", err)
    return inMemoryEmployeesCache
  }
}

export async function deleteStoredEmployee(id: string): Promise<EmployeeRecord[]> {
  try {
    await apiClient.delete(`/employees/${id}`)
    return await fetchEmployeesFromApi()
  } catch (err) {
    console.warn("Failed to delete employee on Neon DB API:", err)
    return inMemoryEmployeesCache
  }
}

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(inMemoryEmployeesCache)

  const reload = useCallback(() => {
    fetchEmployeesFromApi().then(data => {
      setEmployees([...data])
    })
  }, [])

  useEffect(() => {
    reload()

    // 3-second real-time polling loop for multi-device sync
    const interval = setInterval(() => {
      fetchEmployeesFromApi().then(data => {
        setEmployees([...data])
      })
    }, 3000)

    const handleListener = () => {
      setEmployees([...inMemoryEmployeesCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload])

  return [employees, setEmployees] as const
}

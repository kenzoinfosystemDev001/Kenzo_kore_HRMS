"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export type SystemAccessRole = "Super Admin" | "Admin" | "HR" | "Employee"

export interface DocumentVerificationInfo {
  id: string
  title: string
  category: "Government ID" | "Education" | "Financial" | "Employment History"
  mandatory: boolean
  description: string
}

export interface UploadedDocRecord {
  fileName: string
  fileUrl: string
  uploadedAt: string
  status: "Pending Verification" | "Verified" | "Rejected" | "Uploaded"
  notes?: string
}

export const VERIFICATION_DOCUMENTS_LIST: DocumentVerificationInfo[] = [
  { id: "PAN", title: "PAN Card", category: "Government ID", mandatory: true, description: "Permanent Account Number card issued by Income Tax Dept." },
  { id: "AADHAAR", title: "Aadhaar Card", category: "Government ID", mandatory: true, description: "12-digit UIDAI unique identification document." },
  { id: "BANK_PROOF", title: "Cancelled Cheque / Bank Statement", category: "Financial", mandatory: true, description: "Bank proof displaying Account Number & IFSC code." },
  { id: "DEGREE", title: "Highest Educational Degree Certificate", category: "Education", mandatory: true, description: "Graduation / Post-Graduation final degree certificate." },
  { id: "RELIEVING_LETTER", title: "Previous Organization Relieving Letter", category: "Employment History", mandatory: false, description: "Official relieving / experience letter from last employer." },
  { id: "PAYSLIP_PREV", title: "Last 3 Months Salary Slips", category: "Financial", mandatory: false, description: "Salary slips from previous organization for payroll verification." },
]

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  password?: string
  role: string
  systemRole?: SystemAccessRole
  dept: string
  status: "Active" | "On Leave" | "Inactive" | "Terminated"
  joinDate: string
  phone?: string
  avatarUrl?: string
  emergencyPhone?: string
  personalEmail?: string
  maritalStatus?: string
  govtIdType?: string
  govtIdValue?: string
  address?: string
  permanentAddress?: string
  dependentNominee?: string
  dependentNomineeDob?: string
  medicalIssues?: string
  medication?: string
  medicalHistory?: string
  qualification?: string
  scoreCard?: string
  uploadedDocuments?: Record<string, UploadedDocRecord>
}

let inMemoryEmployeesCache: EmployeeRecord[] = []
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchEmployeesFromApi(): Promise<EmployeeRecord[]> {
  try {
    const data = await apiClient.get<Record<string, unknown>[] >('/employees')
    if (Array.isArray(data)) {
      const mapped: EmployeeRecord[] = data.map(e => {
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
          status: e.employmentStatus === 'active' || e.employmentStatus === 'Active' ? 'Active' : String(e.employmentStatus || 'Active') as EmployeeRecord["status"],
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
  const assignedId = emp.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
  const newRec: EmployeeRecord = {
    id: assignedId,
    name: emp.name || 'New Employee',
    email: (emp.email || '').toLowerCase().trim(),
    role: emp.role || 'Software Engineer',
    systemRole: emp.systemRole || 'Employee',
    dept: emp.dept || 'Engineering',
    status: emp.status || 'Active',
    joinDate: emp.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    phone: emp.phone || '',
    password: emp.password || 'kenzo123',
  }

  // Optimistic UI update
  inMemoryEmployeesCache = [newRec, ...inMemoryEmployeesCache.filter(e => e.id !== newRec.id)]
  notifyListeners()

  try {
    const nameParts = (emp.name || '').split(' ')
    const firstName = nameParts[0] || 'New'
    const lastName = nameParts.slice(1).join(' ') || 'Employee'

    await apiClient.post('/employees', {
      firstName,
      lastName,
      email: emp.email,
      password: emp.password || 'kenzo123',
      phone: emp.phone,
      employeeCode: assignedId,
      employmentType: emp.status || 'Active',
      systemRole: emp.systemRole || 'Employee',
    })
    return await fetchEmployeesFromApi()
  } catch (err) {
    // Rollback optimistic update on API error so UI reflects real server state
    inMemoryEmployeesCache = inMemoryEmployeesCache.filter(e => e.id !== newRec.id)
    notifyListeners()
    throw err
  }
}

export async function updateStoredEmployee(emp: Partial<EmployeeRecord>, oldId?: string): Promise<EmployeeRecord[]> {
  const targetId = oldId || emp.id
  if (targetId) {
    inMemoryEmployeesCache = inMemoryEmployeesCache.map(e => (e.id === targetId ? { ...e, ...emp } : e))
    notifyListeners()

    try {
      const nameParts = (emp.name || '').split(' ')
      await apiClient.patch(`/employees/${targetId}`, {
        firstName: nameParts[0] || emp.name,
        lastName: nameParts.slice(1).join(' ') || '',
        phone: emp.phone,
        employmentType: emp.status,
      })
      return await fetchEmployeesFromApi()
    } catch (err) {
      console.warn("Failed to update employee on Neon DB API:", err)
      return fetchEmployeesFromApi()
    }
  }
  return inMemoryEmployeesCache
}

export async function deleteStoredEmployee(id: string): Promise<EmployeeRecord[]> {
  inMemoryEmployeesCache = inMemoryEmployeesCache.filter(e => e.id !== id)
  notifyListeners()

  try {
    await apiClient.delete(`/employees/${id}`)
    return await fetchEmployeesFromApi()
  } catch (err) {
    console.warn("Failed to delete employee on Neon DB API:", err)
    return fetchEmployeesFromApi()
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

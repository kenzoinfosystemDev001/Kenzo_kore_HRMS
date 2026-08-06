"use client"

export interface EmployeeRecord {
  id: string
  name: string
  email: string
  role: string
  dept: string
  status: string
  joinDate: string
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
}

const STORAGE_KEY = "kenzo_hrms_employees_store"

export const DEFAULT_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "EMP-1001",
    name: "Ankit Sethi",
    email: "admin@kenzo.com",
    role: "CEO & Founder",
    dept: "Management",
    status: "Active",
    joinDate: "Jan 01, 2020",
    phone: "+91 98100 12345",
    address: "Executive Suite 401, Tech Park, Noida",
    permanentAddress: "Sector 62, Noida, UP 201301",
    emergencyPhone: "+91 98100 99999",
    personalEmail: "ankit.sethi@example.com",
    govtIdType: "Aadhaar",
    govtIdValue: "4589 1234 5678",
    maritalStatus: "Married",
    dependentNominee: "Spouse",
    dependentNomineeDob: "1990-05-15",
    qualification: "MBA / B.Tech Computer Science",
    scoreCard: "Executive Rating (98/100)",
    medicalIssues: "None",
    medication: "None",
    medicalHistory: "Annual executive health checkup clear",
    documents: "Verified (Aadhaar, Passport, Qualification)",
  },
  {
    id: "EMP-1002",
    name: "Sujal Kumar",
    email: "employee@kenzo.com",
    role: "Software Architect",
    dept: "Engineering",
    status: "Active",
    joinDate: "Jan 15, 2024",
    phone: "6207210784",
    address: "A2 B59 Near Hanuman mandir phase 1 Aayanagar , New Delhi",
    permanentAddress: "DT-10 Dusadh Mhaulla , Chatti baazar Ramgarh cant ,Jharkhand",
    emergencyPhone: "9835123735",
    personalEmail: "sujalreal983@gmail.com",
    govtIdType: "Adhaar",
    govtIdValue: "591730412902",
    maritalStatus: "Single",
    dependentNominee: "Parent / Child Nominee",
    dependentNomineeDob: "2000-01-01",
    qualification: "B.Tech Computer Science",
    scoreCard: "Performance Rating (95/100)",
    medicalIssues: "None",
    medication: "None",
    medicalHistory: "Clean medical history notes",
    documents: "Verified (Adhaar ID, Technical Certifications, Degree)",
  },
]

export function getStoredEmployees(): EmployeeRecord[] {
  if (typeof window === "undefined") return DEFAULT_EMPLOYEES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as EmployeeRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_EMPLOYEES
}

export function saveStoredEmployees(list: EmployeeRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addStoredEmployee(emp: EmployeeRecord) {
  const current = getStoredEmployees()
  const updated = [emp, ...current]
  saveStoredEmployees(updated)
  return updated
}

export function updateStoredEmployee(emp: EmployeeRecord) {
  const current = getStoredEmployees()
  const updated = current.map(e => (e.id === emp.id ? { ...e, ...emp } : e))
  saveStoredEmployees(updated)
  return updated
}

export function deleteStoredEmployee(id: string) {
  const current = getStoredEmployees()
  const updated = current.filter(e => e.id !== id)
  saveStoredEmployees(updated)
  return updated
}

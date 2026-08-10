"use client"

export interface AppraisalRequestRecord {
  id: string
  employeeName: string
  employeeEmail: string
  department: string
  currentRole: string
  requestedRole: string
  currentSalary: string
  requestedSalary: string
  selfRating: number
  justification: string
  status: "Pending" | "Approved" | "Rejected"
  appliedDate: string
  reviewNotes?: string
}

export interface OKRRecord {
  id: string
  title: string
  category: string
  progress: number
  weight: string
  owner: string
  status: "In Progress" | "Completed" | "At Risk"
}

export interface Review360Record {
  id: string
  employeeName: string
  reviewerName: string
  cycle: string
  rating: number
  feedback: string
  status: "Completed" | "Pending"
}

const STORAGE_APPRAISAL_KEY = "kenzo_hrms_appraisal_store"
const STORAGE_OKR_KEY = "kenzo_hrms_okr_store"

export const DEFAULT_APPRAISALS: AppraisalRequestRecord[] = [
  {
    id: "APP-2026-01",
    employeeName: "Sujal Kumar",
    employeeEmail: "Sujal.kumar@kenzoinfosystems.com",
    department: "Engineering",
    currentRole: "Software Engineer",
    requestedRole: "Senior Software Architect",
    currentSalary: "₹12,00,000",
    requestedSalary: "₹18,00,000",
    selfRating: 5,
    justification: "Successfully delivered multi-tenant RBAC architecture, attendance cutoff engine, and enterprise SaaS platform optimizations.",
    status: "Pending",
    appliedDate: "Aug 08, 2026",
  },
]

export const DEFAULT_OKRS: OKRRecord[] = [
  {
    id: "OKR-101",
    title: "Achieve 99.99% Enterprise System Uptime & Security Compliance",
    category: "Engineering",
    progress: 85,
    weight: "30%",
    owner: "Sujal Kumar",
    status: "In Progress",
  },
  {
    id: "OKR-102",
    title: "Expand Corporate Workforce & Streamline Onboarding Pipelines",
    category: "Management",
    progress: 100,
    weight: "40%",
    owner: "Ankit Sethi",
    status: "Completed",
  },
]

export const DEFAULT_REVIEWS: Review360Record[] = [
  {
    id: "REV-501",
    title: "Q3 Executive Performance Assessment",
    employeeName: "Sujal Kumar",
    reviewerName: "Ankit Sethi",
    cycle: "Q3 2026 Review Cycle",
    rating: 4.9,
    feedback: "Exceptional code quality, high velocity, and robust SaaS feature implementation.",
    status: "Completed",
  } as unknown as Review360Record,
]

export function getStoredAppraisals(): AppraisalRequestRecord[] {
  if (typeof window === "undefined") return DEFAULT_APPRAISALS
  try {
    const raw = localStorage.getItem(STORAGE_APPRAISAL_KEY)
    if (raw) return JSON.parse(raw) as AppraisalRequestRecord[]
  } catch {
    // Fallback
  }
  return DEFAULT_APPRAISALS
}

export function saveStoredAppraisals(list: AppraisalRequestRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_APPRAISAL_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addAppraisalRequest(req: AppraisalRequestRecord) {
  const current = getStoredAppraisals()
  const updated = [req, ...current]
  saveStoredAppraisals(updated)
  return updated
}

export function updateAppraisalStatus(id: string, status: "Approved" | "Rejected", notes?: string) {
  const current = getStoredAppraisals()
  const updated = current.map(a => (a.id === id ? { ...a, status, reviewNotes: notes } : a))
  saveStoredAppraisals(updated)
  return updated
}

export function deleteAppraisalRequest(id: string) {
  const current = getStoredAppraisals()
  const updated = current.filter(a => a.id !== id)
  saveStoredAppraisals(updated)
  return updated
}

export function getStoredOKRs(): OKRRecord[] {
  if (typeof window === "undefined") return DEFAULT_OKRS
  try {
    const raw = localStorage.getItem(STORAGE_OKR_KEY)
    if (raw) return JSON.parse(raw) as OKRRecord[]
  } catch {
    // Fallback
  }
  return DEFAULT_OKRS
}

export function addOKR(okr: OKRRecord) {
  const current = getStoredOKRs()
  const updated = [okr, ...current]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_OKR_KEY, JSON.stringify(updated))
  }
  return updated
}

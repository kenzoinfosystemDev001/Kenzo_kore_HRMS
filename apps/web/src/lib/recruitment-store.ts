"use client"

export interface RequisitionRecord {
  id: string
  title: string
  dept: string
  positions: string
  applicants: number
  status: "Active" | "Closed" | "Draft"
  budget: string
}

export interface CandidateRecord {
  id: string
  name: string
  role: string
  stage: string
  rating: number
  email: string
  appliedDate: string
  source: string
}

const STORAGE_REQ_KEY = "kenzo_hrms_requisitions_store_v2"
const STORAGE_CANDIDATE_KEY = "kenzo_hrms_candidates_store_v2"

export const DEFAULT_REQUISITIONS: RequisitionRecord[] = [
  {
    id: "REQ-201",
    title: "Senior Full Stack Engineer (Next.js & Node)",
    dept: "Engineering",
    positions: "2 Open",
    applicants: 12,
    status: "Active",
    budget: "₹25L - ₹35L",
  },
  {
    id: "REQ-202",
    title: "Lead HR Business Partner",
    dept: "Human Resources",
    positions: "1 Open",
    applicants: 8,
    status: "Active",
    budget: "₹18L - ₹24L",
  },
]

export const DEFAULT_CANDIDATES: CandidateRecord[] = [
  {
    id: "CAND-101",
    name: "Rohan Verma",
    role: "Senior Full Stack Engineer",
    stage: "Technical Interview",
    rating: 5,
    email: "rohan.verma@example.com",
    appliedDate: "Aug 02, 2026",
    source: "LinkedIn",
  },
  {
    id: "CAND-102",
    name: "Priya Sharma",
    role: "Lead HR Business Partner",
    stage: "Offer Extended",
    rating: 5,
    email: "priya.sharma@example.com",
    appliedDate: "Aug 04, 2026",
    source: "Company Portal",
  },
]

export function getStoredRequisitions(): RequisitionRecord[] {
  if (typeof window === "undefined") return DEFAULT_REQUISITIONS
  try {
    const raw = localStorage.getItem(STORAGE_REQ_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RequisitionRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_REQUISITIONS
}

export function saveStoredRequisitions(list: RequisitionRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_REQ_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addRequisition(req: RequisitionRecord) {
  const current = getStoredRequisitions()
  const updated = [req, ...current]
  saveStoredRequisitions(updated)
  return updated
}

export function deleteRequisition(id: string) {
  const current = getStoredRequisitions()
  const updated = current.filter(r => r.id !== id)
  saveStoredRequisitions(updated)
  return updated
}

export function getStoredCandidates(): CandidateRecord[] {
  if (typeof window === "undefined") return DEFAULT_CANDIDATES
  try {
    const raw = localStorage.getItem(STORAGE_CANDIDATE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CandidateRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_CANDIDATES
}

export function saveStoredCandidates(list: CandidateRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_CANDIDATE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addCandidate(cand: CandidateRecord) {
  const current = getStoredCandidates()
  const updated = [cand, ...current]
  saveStoredCandidates(updated)
  return updated
}

export function deleteCandidate(id: string) {
  const current = getStoredCandidates()
  const updated = current.filter(c => c.id !== id)
  saveStoredCandidates(updated)
  return updated
}

export function updateCandidateStage(id: string, stage: string) {
  const current = getStoredCandidates()
  const updated = current.map(c => (c.id === id ? { ...c, stage } : c))
  saveStoredCandidates(updated)
  return updated
}

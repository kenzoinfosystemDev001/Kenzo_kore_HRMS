"use client"

export interface NewHireRecord {
  id: string
  name: string
  email: string
  role: string
  dept: string
  joinDate: string
  progress: number
  buddy: string
  status: "In Progress" | "Completed" | "Pending Assets"
  itAssetsAssigned: string
  docSignatures: string
}

const STORAGE_KEY = "kenzo_hrms_onboarding_store"

export const DEFAULT_ONBOARDING: NewHireRecord[] = [
  {
    id: "ONB-101",
    name: "Chanchal Saini",
    email: "Chanchal.saini@kenzoinfosystems.com",
    role: "Managing Director",
    dept: "Administration",
    joinDate: "Aug 07, 2026",
    progress: 90,
    buddy: "Ankit Sethi",
    status: "In Progress",
    itAssetsAssigned: "MacBook Pro M3 Max + 4K Monitor",
    docSignatures: "4 / 4 Signed",
  },
  {
    id: "ONB-102",
    name: "Laxmi Narayan",
    email: "Laxminarayan.ojha@kenzoinfosystems.com",
    role: "Backend Engineer",
    dept: "Engineering",
    joinDate: "Aug 10, 2026",
    progress: 60,
    buddy: "Sujal Kumar",
    status: "In Progress",
    itAssetsAssigned: "ThinkPad Workstation + YubiKey",
    docSignatures: "3 / 4 Signed",
  },
]

export function getStoredOnboardings(): NewHireRecord[] {
  if (typeof window === "undefined") return DEFAULT_ONBOARDING
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as NewHireRecord[]
  } catch {
    // Fallback
  }
  return DEFAULT_ONBOARDING
}

export function saveStoredOnboardings(list: NewHireRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addOnboardingPipeline(record: NewHireRecord) {
  const current = getStoredOnboardings()
  const updated = [record, ...current]
  saveStoredOnboardings(updated)
  return updated
}

export function updateOnboardingProgress(id: string, progress: number, status: "In Progress" | "Completed" | "Pending Assets") {
  const current = getStoredOnboardings()
  const updated = current.map(o => (o.id === id ? { ...o, progress, status } : o))
  saveStoredOnboardings(updated)
  return updated
}

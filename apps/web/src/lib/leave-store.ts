"use client"

export interface LeaveRequestRecord {
  id: string
  employeeName: string
  employeeEmail: string
  leaveType: string
  days: number
  startDate: string
  endDate: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  appliedDate: string
}

const STORAGE_KEY = "kenzo_hrms_leave_store"

export const DEFAULT_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  {
    id: "LV-2026-901",
    employeeName: "Sujal Kumar",
    employeeEmail: "Sujal.kumar@kenzoinfosystems.com",
    leaveType: "Casual Leave",
    days: 1,
    startDate: "2026-08-10",
    endDate: "2026-08-10",
    reason: "Personal family commitment",
    status: "Pending",
    appliedDate: "Aug 05, 2026",
  },
]

export function getStoredLeaves(): LeaveRequestRecord[] {
  if (typeof window === "undefined") return DEFAULT_LEAVE_REQUESTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as LeaveRequestRecord[]
      if (parsed) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_LEAVE_REQUESTS
}

export function saveStoredLeaves(list: LeaveRequestRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function updateLeaveStatus(id: string, status: "Approved" | "Rejected") {
  const current = getStoredLeaves()
  const updated = current.map(l => (l.id === id ? { ...l, status } : l))
  saveStoredLeaves(updated)
  return updated
}

export function addLeaveRequest(req: LeaveRequestRecord) {
  const current = getStoredLeaves()
  const updated = [req, ...current]
  saveStoredLeaves(updated)
  return updated
}

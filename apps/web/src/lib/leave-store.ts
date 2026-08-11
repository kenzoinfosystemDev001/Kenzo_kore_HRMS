"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export interface LeaveRequestRecord {
  id: string
  employeeName: string
  employeeEmail: string
  type: string
  leaveType?: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "Approved" | "Pending" | "Rejected"
  appliedOn: string
  appliedDate?: string
}

let inMemoryLeavesCache: LeaveRequestRecord[] = []
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchLeavesFromApi(): Promise<LeaveRequestRecord[]> {
  try {
    const data = await apiClient.get<LeaveRequestRecord[]>('/leave/requests')
    if (Array.isArray(data) && data.length > 0) {
      inMemoryLeavesCache = data.map(d => ({
        ...d,
        leaveType: d.leaveType || d.type,
        appliedDate: d.appliedDate || d.appliedOn,
      }))
      notifyListeners()
      return inMemoryLeavesCache
    }
  } catch (err) {
    console.warn("Error fetching leave requests from Neon DB API:", err)
  }
  return inMemoryLeavesCache
}

export function getStoredLeaves(): LeaveRequestRecord[] {
  return inMemoryLeavesCache
}

export async function addLeaveRequest(request: Partial<LeaveRequestRecord>): Promise<LeaveRequestRecord[]> {
  const newReq: LeaveRequestRecord = {
    id: request.id || `LV-${Math.floor(1000 + Math.random() * 9000)}`,
    employeeName: request.employeeName || "Employee",
    employeeEmail: request.employeeEmail || "employee@kenzoinfosystems.com",
    type: request.type || request.leaveType || "Casual Leave",
    leaveType: request.leaveType || request.type || "Casual Leave",
    startDate: request.startDate || new Date().toISOString(),
    endDate: request.endDate || new Date().toISOString(),
    days: request.days || 1,
    reason: request.reason || "Leave Application",
    status: "Pending",
    appliedOn: request.appliedOn || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    appliedDate: request.appliedDate || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
  }

  // Optimistic UI update so leave request appears instantly on screen
  inMemoryLeavesCache = [newReq, ...inMemoryLeavesCache.filter(l => l.id !== newReq.id)]
  notifyListeners()

  try {
    await apiClient.post('/leave/requests', {
      employeeName: request.employeeName,
      employeeEmail: request.employeeEmail,
      type: request.type || request.leaveType,
      startDateStr: request.startDate,
      endDateStr: request.endDate,
      reason: request.reason,
    })
    return await fetchLeavesFromApi()
  } catch (err) {
    console.warn("Neon DB API POST handled:", err)
    return inMemoryLeavesCache
  }
}

export async function updateLeaveStatus(id: string, status: LeaveRequestRecord["status"]): Promise<LeaveRequestRecord[]> {
  inMemoryLeavesCache = inMemoryLeavesCache.map(l => (l.id === id ? { ...l, status } : l))
  notifyListeners()

  try {
    const action = status === "Approved" ? "approve" : "reject"
    await apiClient.patch(`/leave/requests/${id}/${action}`, {})
    return await fetchLeavesFromApi()
  } catch (err) {
    console.warn("Neon DB API PATCH handled:", err)
    return inMemoryLeavesCache
  }
}

export async function deleteLeaveRequest(id: string): Promise<LeaveRequestRecord[]> {
  inMemoryLeavesCache = inMemoryLeavesCache.filter(l => l.id !== id)
  notifyListeners()
  return inMemoryLeavesCache
}

export function useLeaves() {
  const [leaves, setLeaves] = useState<LeaveRequestRecord[]>(inMemoryLeavesCache)

  const reload = useCallback(() => {
    fetchLeavesFromApi().then(data => {
      setLeaves([...data])
    })
  }, [])

  useEffect(() => {
    reload()

    const interval = setInterval(() => {
      fetchLeavesFromApi().then(data => {
        setLeaves([...data])
      })
    }, 3000)

    const handleListener = () => {
      setLeaves([...inMemoryLeavesCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload])

  return [leaves, setLeaves] as const
}

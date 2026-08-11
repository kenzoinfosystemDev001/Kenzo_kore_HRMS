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
    if (Array.isArray(data)) {
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
    console.warn("Failed to create leave request on Neon DB API:", err)
    return inMemoryLeavesCache
  }
}

export async function updateLeaveStatus(id: string, status: LeaveRequestRecord["status"]): Promise<LeaveRequestRecord[]> {
  try {
    const action = status === "Approved" ? "approve" : "reject"
    await apiClient.patch(`/leave/requests/${id}/${action}`, {})
    return await fetchLeavesFromApi()
  } catch (err) {
    console.warn("Failed to update leave status on Neon DB API:", err)
    return inMemoryLeavesCache
  }
}

export async function deleteLeaveRequest(id: string): Promise<LeaveRequestRecord[]> {
  try {
    return await fetchLeavesFromApi()
  } catch {
    return inMemoryLeavesCache
  }
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

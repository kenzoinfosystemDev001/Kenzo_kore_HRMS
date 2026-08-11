"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export type AttendanceStatus = "Present" | "Late" | "Half Day" | "Absent" | "On Leave"

export interface AttendanceRecord {
  id: string
  employeeEmail: string
  employeeName: string
  date: string
  checkIn: string
  checkOut?: string
  status: AttendanceStatus
  workHours?: string
  totalHours?: number
  location?: string
  department?: string
  avatar?: string
  notes?: string
}

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT-1001",
    employeeEmail: "Ankit.sethi@kenzoinfosystems.com",
    employeeName: "Ankit Sethi",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workHours: "9.0 hrs",
    location: "Office Web Portal",
    department: "Executive Management",
  },
  {
    id: "ATT-1002",
    employeeEmail: "Sujal.kumar@kenzoinfosystems.com",
    employeeName: "Sujal Kumar",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    checkIn: "09:15 AM",
    checkOut: "06:15 PM",
    status: "Present",
    workHours: "9.0 hrs",
    location: "Office Web Portal",
    department: "Engineering & Technology",
  },
]

let inMemoryAttendanceCache: AttendanceRecord[] = []
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchAttendanceFromApi(): Promise<AttendanceRecord[]> {
  try {
    const raw = await apiClient.get<Record<string, unknown>[] >('/attendance')
    if (Array.isArray(raw)) {
      const mapped: AttendanceRecord[] = raw.map(a => ({
        id: String(a.id || `ATT-${Math.random()}`),
        employeeEmail: String(a.employeeEmail || ''),
        employeeName: String(a.employeeName || 'Employee'),
        date: String(a.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })),
        checkIn: a.checkIn ? String(a.checkIn) : undefined as unknown as string,
        checkOut: a.checkOut ? String(a.checkOut) : undefined,
        status: (a.status as AttendanceStatus) || 'Absent',
        workHours: a.workHours ? String(a.workHours) : undefined,
        location: String(a.location || 'Office Web Portal'),
        department: String(a.department || 'General'),
      }))
      inMemoryAttendanceCache = mapped
      notifyListeners()
      return mapped
    }
  } catch (err) {
    console.warn("Error fetching attendance records from API:", err)
  }
  return inMemoryAttendanceCache
}

export function getAttendanceForEmail(email?: string): AttendanceRecord | undefined {
  if (!email) return undefined
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  return inMemoryAttendanceCache.find(a => a.employeeEmail.toLowerCase() === email.toLowerCase() && a.date === todayStr)
}

export function getStoredAttendanceByDate(): AttendanceRecord[] {
  return inMemoryAttendanceCache
}

export async function clockInUser(email: string, name: string): Promise<AttendanceRecord> {
  try {
    await apiClient.post('/attendance/clock-in', {
      employeeEmail: email,
      employeeName: name,
      method: 'web',
    })
    await fetchAttendanceFromApi()
  } catch (err) {
    console.warn("Failed to clock in on Neon DB API:", err)
  }

  const existing = getAttendanceForEmail(email)
  if (existing) return existing

  const newRec: AttendanceRecord = {
    id: `ATT-${Date.now()}`,
    employeeEmail: email,
    employeeName: name,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    checkIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: 'Present',
    location: 'Office Web Portal',
    department: 'Engineering',
  }

  inMemoryAttendanceCache = [newRec, ...inMemoryAttendanceCache]
  notifyListeners()
  return newRec
}

export async function clockInEmployee(email: string, name?: string): Promise<AttendanceRecord> {
  return clockInUser(email, name || 'Employee')
}

export async function clockOutUser(email: string): Promise<AttendanceRecord | undefined> {
  try {
    await apiClient.post('/attendance/clock-out', {
      employeeEmail: email,
      method: 'web',
    })
    await fetchAttendanceFromApi()
  } catch (err) {
    console.warn("Failed to clock out on Neon DB API:", err)
  }

  const rec = getAttendanceForEmail(email)
  if (rec) {
    rec.checkOut = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    rec.workHours = '8.0 hrs'
    notifyListeners()
  }
  return rec
}

export async function clockOutEmployee(email: string): Promise<AttendanceRecord | undefined> {
  return clockOutUser(email)
}

export function regularizeAttendance(): AttendanceRecord[] {
  return inMemoryAttendanceCache
}

export function useAttendanceLogs() {
  const [logs, setLogs] = useState<AttendanceRecord[]>(inMemoryAttendanceCache)

  const reload = useCallback(() => {
    fetchAttendanceFromApi().then(data => {
      setLogs([...data])
    })
  }, [])

  useEffect(() => {
    reload()

    const interval = setInterval(() => {
      fetchAttendanceFromApi().then(data => {
        setLogs([...data])
      })
    }, 3000)

    const handleListener = () => {
      setLogs([...inMemoryAttendanceCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload])

  return [logs, setLogs] as const
}

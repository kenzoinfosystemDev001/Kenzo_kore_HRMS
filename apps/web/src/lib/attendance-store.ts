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

let inMemoryAttendanceCache: AttendanceRecord[] = []
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchAttendanceFromApi(): Promise<AttendanceRecord[]> {
  try {
    const raw = await apiClient.get<Record<string, unknown>[] >('/attendance')
    if (Array.isArray(raw)) {
      const mapped: AttendanceRecord[] = (raw as Record<string, unknown>[]).map(a => {
        const emp = (a.employee as Record<string, unknown>) || {}
        const checkInVal = a.checkIn as string | undefined
        const checkOutVal = a.checkOut as string | undefined
        const inDate = checkInVal ? new Date(checkInVal) : null
        const outDate = checkOutVal ? new Date(checkOutVal) : null
        const totalHrs = typeof a.totalHours === 'number' ? a.totalHours : undefined
        return {
          id: String(a.id || ''),
          employeeEmail: String(emp.workEmail || 'employee@kenzoinfosystems.com'),
          employeeName: `${String(emp.firstName || '')} ${String(emp.lastName || '')}`.trim() || 'Employee',
          date: a.date ? new Date(String(a.date)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString(),
          checkIn: inDate ? inDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
          checkOut: outDate ? outDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
          status: totalHrs && totalHrs < 4 ? 'Half Day' : 'Present',
          workHours: totalHrs ? `${totalHrs.toFixed(1)} hrs` : undefined,
          totalHours: totalHrs,
          location: String(a.checkInMethod || 'Office Web Portal'),
          department: 'Engineering',
        }
      })
      inMemoryAttendanceCache = mapped
      notifyListeners()
      return mapped
    }
  } catch (err) {
    console.warn("Error fetching attendance records from Neon DB API:", err)
  }
  return inMemoryAttendanceCache
}

export function getAttendanceForEmail(email?: string): AttendanceRecord | undefined {
  if (!email) return undefined
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  return inMemoryAttendanceCache.find(a => a.employeeEmail.toLowerCase() === email.toLowerCase() && a.date === todayStr)
}

export function getStoredAttendanceByDate(_date?: string): AttendanceRecord[] {
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

export async function clockInEmployee(email: string, name?: string, _time?: string, _status?: AttendanceStatus, _loc?: string): Promise<AttendanceRecord> {
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

export async function clockOutEmployee(email: string, _time?: string, _workHours?: string, _loc?: string, _notes?: string): Promise<AttendanceRecord | undefined> {
  return clockOutUser(email)
}

export function regularizeAttendance(_record: Partial<AttendanceRecord>): AttendanceRecord[] {
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

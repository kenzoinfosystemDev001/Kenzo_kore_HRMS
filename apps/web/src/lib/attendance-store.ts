"use client"

import { getStoredEmployees, EmployeeRecord } from "./employee-store"

export type AttendanceStatus = "Present" | "Late" | "Half Day" | "Absent" | "On Leave"

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  avatar: string
  department: string
  date: string
  checkIn: string | null
  checkOut: string | null
  totalHours: string | null
  status: AttendanceStatus
  notes?: string
}

const STORAGE_KEY = "kenzo_hrms_attendance_store"

/**
 * Cutoff Logic:
 * - Clock-in <= 10:30 AM -> "Present"
 * - Clock-in between 10:31 AM and 12:30 PM -> "Late"
 * - Clock-in AFTER 12:30 PM -> "Half Day"
 * - Not clocked in -> "Absent"
 */
export function calculateAttendanceStatus(clockInDate: Date): AttendanceStatus {
  const hours = clockInDate.getHours()
  const minutes = clockInDate.getMinutes()
  const totalMinutes = hours * 60 + minutes

  const cutOffHalfDay = 12 * 60 + 30 // 12:30 PM (750 mins)
  const cutOffLate = 10 * 60 + 30    // 10:30 AM (630 mins)

  if (totalMinutes > cutOffHalfDay) {
    return "Half Day"
  } else if (totalMinutes > cutOffLate) {
    return "Late"
  } else {
    return "Present"
  }
}

export function calculateDuration(checkInStr: string, checkOutStr: string): string {
  try {
    const parseTime = (tStr: string) => {
      const [time, modifier] = tStr.split(" ")
      let [h, m] = time.split(":").map(Number)
      if (modifier === "PM" && h < 12) h += 12
      if (modifier === "AM" && h === 12) h = 0
      return h * 60 + m
    }
    const startMins = parseTime(checkInStr)
    const endMins = parseTime(checkOutStr)
    const diff = Math.max(0, endMins - startMins)
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  } catch {
    return "8h 00m"
  }
}

function generateDefaultRecords(employees: EmployeeRecord[], todayStr: string): AttendanceRecord[] {
  return employees.map(emp => {
    const initials = emp.name.split(" ").map(n => n[0]).join("").toUpperCase()
    
    // Seed default realistic times for master accounts
    if (emp.email.toLowerCase().includes("ankit.sethi")) {
      return {
        id: `ATT-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeEmail: emp.email,
        avatar: initials,
        department: emp.dept,
        date: todayStr,
        checkIn: "09:00 AM",
        checkOut: "06:30 PM",
        totalHours: "9h 30m",
        status: "Present",
      }
    }

    if (emp.email.toLowerCase().includes("sujal.kumar")) {
      return {
        id: `ATT-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeEmail: emp.email,
        avatar: initials,
        department: emp.dept,
        date: todayStr,
        checkIn: "09:15 AM",
        checkOut: "06:45 PM",
        totalHours: "9h 30m",
        status: "Present",
      }
    }

    // Default for newly created employees: Absent until they clock in
    return {
      id: `ATT-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeEmail: emp.email,
      avatar: initials,
      department: emp.dept,
      date: todayStr,
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: "Absent",
    }
  })
}

function syncEmployeesWithAttendance(stored: AttendanceRecord[], employees: EmployeeRecord[], todayStr: string): AttendanceRecord[] {
  const existingMap = new Map(stored.map(r => [r.employeeEmail.toLowerCase(), r]))

  const synced: AttendanceRecord[] = employees.map(emp => {
    const existing = existingMap.get(emp.email.toLowerCase())
    if (existing) {
      return {
        ...existing,
        employeeName: emp.name,
        department: emp.dept,
      }
    }

    // New employee added by Admin that wasn't in attendance store yet
    const initials = emp.name.split(" ").map(n => n[0]).join("").toUpperCase()
    return {
      id: `ATT-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeEmail: emp.email,
      avatar: initials,
      department: emp.dept,
      date: todayStr,
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: "Absent",
    }
  })

  return synced
}

export function getStoredAttendance(): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split("T")[0]
  const employees = getStoredEmployees()

  if (typeof window === "undefined") return generateDefaultRecords(employees, todayStr)

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AttendanceRecord[]
      const synced = syncEmployeesWithAttendance(parsed, employees, todayStr)
      saveStoredAttendance(synced)
      return synced
    }
  } catch {
    // Ignore fallback
  }

  const initial = generateDefaultRecords(employees, todayStr)
  saveStoredAttendance(initial)
  return initial
}

export function saveStoredAttendance(records: AttendanceRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // Ignore storage errors
  }
}

export function clockInEmployee(email: string): AttendanceRecord[] {
  const records = getStoredAttendance()
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const status = calculateAttendanceStatus(now)

  const updated = records.map(r => {
    if (r.employeeEmail.toLowerCase() === email.toLowerCase()) {
      return {
        ...r,
        checkIn: timeStr,
        status: status,
        notes: status === "Half Day" ? "Clocked in after 12:30 PM (Marked Half Day)" : (status === "Late" ? "Clocked in after 10:30 AM (Late Arrival)" : undefined)
      }
    }
    return r
  })

  saveStoredAttendance(updated)
  return updated
}

export function clockOutEmployee(email: string): AttendanceRecord[] {
  const records = getStoredAttendance()
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const updated = records.map(r => {
    if (r.employeeEmail.toLowerCase() === email.toLowerCase()) {
      let duration = "8h 00m"
      if (r.checkIn) {
        duration = calculateDuration(r.checkIn, timeStr)
      }
      return {
        ...r,
        checkOut: timeStr,
        totalHours: duration
      }
    }
    return r
  })

  saveStoredAttendance(updated)
  return updated
}

export function regularizeAttendance(employeeEmail: string, checkIn: string, checkOut: string, reason: string): AttendanceRecord[] {
  const records = getStoredAttendance()
  const updated = records.map(r => {
    if (r.employeeEmail.toLowerCase() === employeeEmail.toLowerCase()) {
      const duration = calculateDuration(checkIn, checkOut)
      return {
        ...r,
        checkIn: checkIn,
        checkOut: checkOut,
        totalHours: duration,
        status: "Present" as AttendanceStatus,
        notes: `Regularized: ${reason}`
      }
    }
    return r
  })

  saveStoredAttendance(updated)
  return updated
}

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

const STORAGE_KEY = "kenzo_hrms_attendance_map_v2"

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
      const [parsedH, m] = time.split(":").map(Number)
      let h = parsedH
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

function generateDefaultRecords(employees: EmployeeRecord[], targetDate: string): AttendanceRecord[] {
  return employees.map(emp => {
    const initials = emp.name.split(" ").map(n => n[0]).join("").toUpperCase()
    
    // Seed default realistic times for master accounts
    if (emp.email.toLowerCase().includes("ankit.sethi")) {
      return {
        id: `ATT-${emp.id}-${targetDate}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeEmail: emp.email,
        avatar: initials,
        department: emp.dept,
        date: targetDate,
        checkIn: "09:00 AM",
        checkOut: "06:30 PM",
        totalHours: "9h 30m",
        status: "Present",
      }
    }

    if (emp.email.toLowerCase().includes("sujal.kumar")) {
      return {
        id: `ATT-${emp.id}-${targetDate}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeEmail: emp.email,
        avatar: initials,
        department: emp.dept,
        date: targetDate,
        checkIn: "09:15 AM",
        checkOut: "06:45 PM",
        totalHours: "9h 30m",
        status: "Present",
      }
    }

    // Default for newly created employees: Absent until they clock in
    return {
      id: `ATT-${emp.id}-${targetDate}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeEmail: emp.email,
      avatar: initials,
      department: emp.dept,
      date: targetDate,
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: "Absent",
    }
  })
}

function syncEmployeesWithAttendance(stored: AttendanceRecord[], employees: EmployeeRecord[], targetDate: string): AttendanceRecord[] {
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

    const initials = emp.name.split(" ").map(n => n[0]).join("").toUpperCase()
    return {
      id: `ATT-${emp.id}-${targetDate}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeEmail: emp.email,
      avatar: initials,
      department: emp.dept,
      date: targetDate,
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: "Absent",
    }
  })

  return synced
}

export function getAllAttendanceMap(): Record<string, AttendanceRecord[]> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as Record<string, AttendanceRecord[]>
    }
  } catch {
    // Ignore error
  }
  return {}
}

export function saveAllAttendanceMap(map: Record<string, AttendanceRecord[]>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Ignore error
  }
}

export function getStoredAttendanceByDate(dateStr?: string): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split("T")[0]
  const targetDate = dateStr || todayStr
  const employees = getStoredEmployees()
  const map = getAllAttendanceMap()

  if (map[targetDate]) {
    const synced = syncEmployeesWithAttendance(map[targetDate], employees, targetDate)
    map[targetDate] = synced
    saveAllAttendanceMap(map)
    return synced
  }

  const initial = generateDefaultRecords(employees, targetDate)
  map[targetDate] = initial
  saveAllAttendanceMap(map)
  return initial
}

export function getStoredAttendance(): AttendanceRecord[] {
  return getStoredAttendanceByDate()
}

export function clockInEmployee(email: string, dateStr?: string): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split("T")[0]
  const targetDate = dateStr || todayStr

  // Restrict marking attendance strictly to current day only!
  if (targetDate !== todayStr) {
    throw new Error("Attendance marking is restricted strictly to the current day.")
  }

  const records = getStoredAttendanceByDate(targetDate)
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

  const map = getAllAttendanceMap()
  map[targetDate] = updated
  saveAllAttendanceMap(map)
  return updated
}

export function clockOutEmployee(email: string, dateStr?: string): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split("T")[0]
  const targetDate = dateStr || todayStr

  // Restrict marking attendance strictly to current day only!
  if (targetDate !== todayStr) {
    throw new Error("Attendance marking is restricted strictly to the current day.")
  }

  const records = getStoredAttendanceByDate(targetDate)
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

  const map = getAllAttendanceMap()
  map[targetDate] = updated
  saveAllAttendanceMap(map)
  return updated
}

export function regularizeAttendance(employeeEmail: string, checkIn: string, checkOut: string, reason: string, dateStr?: string): AttendanceRecord[] {
  const todayStr = new Date().toISOString().split("T")[0]
  const targetDate = dateStr || todayStr
  const records = getStoredAttendanceByDate(targetDate)

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

  const map = getAllAttendanceMap()
  map[targetDate] = updated
  saveAllAttendanceMap(map)
  return updated
}

"use client"

export interface UserNotification {
  id: string
  targetEmail: string
  title: string
  message: string
  type: "PAYSLIP" | "APPRAISAL" | "LEAVE" | "EXPENSE" | "GENERAL" | "HELP"
  payslipId?: string
  date: string
  isRead: boolean
}

const STORAGE_KEY = "kenzo_hrms_user_notifications"

export function getStoredNotifications(): UserNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserNotification[]
  } catch {
    // Ignore fallback
  }
  return []
}

export function saveStoredNotifications(list: UserNotification[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Ignore fallback
  }
}

let notifCounter = 1000

export function addTargetNotification(notif: Omit<UserNotification, "id"> & { id?: string }) {
  notifCounter += 1
  const fullNotif: UserNotification = {
    id: notif.id || `NOTIF-${notifCounter}`,
    ...notif,
  }
  const current = getStoredNotifications()
  const updated = [fullNotif, ...current]
  saveStoredNotifications(updated)
  return updated
}

export function getNotificationsForUser(email?: string): UserNotification[] {
  if (!email) return []
  const current = getStoredNotifications()
  return current.filter(n => n.targetEmail.toLowerCase() === email.toLowerCase())
}

export function markNotificationAsRead(id: string) {
  const current = getStoredNotifications()
  const updated = current.map(n => (n.id === id ? { ...n, isRead: true } : n))
  saveStoredNotifications(updated)
  return updated
}

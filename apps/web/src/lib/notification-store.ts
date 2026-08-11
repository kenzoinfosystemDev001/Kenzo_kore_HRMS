"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export interface UserNotification {
  id: string
  targetEmail: string
  title: string
  message: string
  type: "INFO" | "LEAVE" | "PAYROLL" | "PERFORMANCE" | "SYSTEM" | "HELP" | "EXPENSE" | "APPRAISAL" | "PAYSLIP"
  date: string
  isRead: boolean
  payslipId?: string
}

let inMemoryNotificationsCache: UserNotification[] = []
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchNotificationsFromApi(): Promise<UserNotification[]> {
  try {
    const raw = await apiClient.get<Record<string, unknown>[] >('/notifications')
    if (Array.isArray(raw)) {
      const mapped: UserNotification[] = (raw as Record<string, unknown>[]).map(n => {
        const u = (n.user as Record<string, unknown>) || {}
        return {
          id: String(n.id || ''),
          targetEmail: String(u.email || 'all'),
          title: String(n.title || ''),
          message: String(n.message || ''),
          type: (n.type || 'INFO') as UserNotification["type"],
          date: n.createdAt ? new Date(String(n.createdAt)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString(),
          isRead: Boolean(n.isRead),
        }
      })
      inMemoryNotificationsCache = mapped
      notifyListeners()
      return mapped
    }
  } catch (err) {
    console.warn("Error fetching notifications from Neon DB API:", err)
  }
  return inMemoryNotificationsCache
}

export function getNotificationsForUser(email: string): UserNotification[] {
  if (!email) return []
  return inMemoryNotificationsCache.filter(
    n => n.targetEmail.toLowerCase() === email.toLowerCase() || n.targetEmail.toLowerCase() === "all"
  )
}

export async function addTargetNotification(notification: Omit<UserNotification, "id">): Promise<UserNotification[]> {
  try {
    await apiClient.post('/notifications', {
      targetEmail: notification.targetEmail,
      title: notification.title,
      message: notification.message,
      type: notification.type,
    })
    return await fetchNotificationsFromApi()
  } catch (err) {
    console.warn("Failed to create notification on Neon DB API:", err)
    return inMemoryNotificationsCache
  }
}

export async function markNotificationAsRead(id: string): Promise<UserNotification[]> {
  try {
    await apiClient.patch(`/notifications/${id}/read`, {})
    return await fetchNotificationsFromApi()
  } catch (err) {
    console.warn("Failed to mark notification as read on Neon DB API:", err)
    return inMemoryNotificationsCache
  }
}

export function useNotifications(email?: string) {
  const [notifs, setNotifs] = useState<UserNotification[]>(() => email ? getNotificationsForUser(email) : inMemoryNotificationsCache)

  const reload = useCallback(() => {
    fetchNotificationsFromApi().then(() => {
      if (email) setNotifs(getNotificationsForUser(email))
      else setNotifs([...inMemoryNotificationsCache])
    })
  }, [email])

  useEffect(() => {
    reload()

    const interval = setInterval(() => {
      fetchNotificationsFromApi().then(() => {
        if (email) setNotifs(getNotificationsForUser(email))
        else setNotifs([...inMemoryNotificationsCache])
      })
    }, 3000)

    const handleListener = () => {
      if (email) setNotifs(getNotificationsForUser(email))
      else setNotifs([...inMemoryNotificationsCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload, email])

  return [notifs, setNotifs] as const
}

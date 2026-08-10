"use client"

import { getStoredEmployees } from "./employee-store"

export interface ChatMessage {
  id: string
  senderEmail: string
  senderName: string
  recipientEmail: string
  recipientName: string
  content: string
  timestamp: string
  isRead?: boolean
}

const STORAGE_KEY = "kenzo_hrms_messages_store_v3"

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "MSG-101",
    senderEmail: "Ankit.sethi@kenzoinfosystems.com",
    senderName: "Ankit Sethi (Master Admin)",
    recipientEmail: "Sujal.kumar@kenzoinfosystems.com",
    recipientName: "Sujal Kumar",
    content: "Welcome to Kenzo HRMS portal! Feel free to reach out directly here for any administrative assistance.",
    timestamp: "10:30 AM",
    isRead: false,
  },
  {
    id: "MSG-102",
    senderEmail: "Sujal.kumar@kenzoinfosystems.com",
    senderName: "Sujal Kumar",
    recipientEmail: "Ankit.sethi@kenzoinfosystems.com",
    recipientName: "Ankit Sethi (Master Admin)",
    content: "Thank you Ankit! All system modules and appraisal pipelines are operating smoothly.",
    timestamp: "10:32 AM",
    isRead: true,
  },
]

export function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return DEFAULT_MESSAGES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_MESSAGES
}

export function saveStoredMessages(list: ChatMessage[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function sendChatMessage(msg: Omit<ChatMessage, "id" | "timestamp">) {
  const current = getStoredMessages()
  const newMsg: ChatMessage = {
    id: `MSG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isRead: false,
    ...msg,
  }
  const updated = [...current, newMsg]
  saveStoredMessages(updated)
  return updated
}

export function getUnreadMessagesCount(userEmail?: string): number {
  if (!userEmail) return 0
  const current = getStoredMessages()
  return current.filter(
    m => m.recipientEmail.toLowerCase() === userEmail.toLowerCase() && m.isRead === false
  ).length
}

export function markMessagesAsRead(userEmail?: string, senderEmail?: string) {
  if (!userEmail) return getStoredMessages()
  const current = getStoredMessages()
  const updated = current.map(m => {
    const isTargetRecipient = m.recipientEmail.toLowerCase() === userEmail.toLowerCase()
    const matchesSender = !senderEmail || m.senderEmail.toLowerCase() === senderEmail.toLowerCase()
    if (isTargetRecipient && matchesSender) {
      return { ...m, isRead: true }
    }
    return m
  })
  saveStoredMessages(updated)
  return updated
}

/**
 * Filter list of available recipients:
 * If user is a regular employee (!isAdmin), return ALL Admin & HR Management leaders with explicit names & designations!
 * If user is an Admin (isAdmin), return all employees and admins.
 */
export function getAvailableChatRecipients(isUserAdmin: boolean, currentEmail?: string): { email: string; name: string; role: string }[] {
  const allEmployees = getStoredEmployees()
  
  // Explicit Admin & HR Management Leadership List
  const adminRecipients = [
    { email: "Ankit.sethi@kenzoinfosystems.com", name: "Ankit Sethi", role: "Master Admin" },
    { email: "admin@kenzoinfosystems.com", name: "HR Executive Admin", role: "HR Admin" },
    { email: "chanchal.saini@kenzoinfosystems.com", name: "Chanchal Saini", role: "Managing Director" },
    { email: "jitender.saini@kenzoinfosystems.com", name: "Jitender Saini", role: "CEO" },
    { email: "hr.board@kenzoinfosystems.com", name: "Executive HR Board", role: "HR Management" },
  ]

  if (!isUserAdmin) {
    // Regular employees can send messages to all Admins & HR Leadership!
    return adminRecipients.filter(a => a.email.toLowerCase() !== currentEmail?.toLowerCase())
  }

  // Admins can message any employee or admin
  const employeeRecipients = allEmployees.map(e => ({
    email: e.email,
    name: e.name,
    role: e.role || "Employee",
  }))

  const combinedMap = new Map<string, { email: string; name: string; role: string }>()
  adminRecipients.forEach(a => combinedMap.set(a.email.toLowerCase(), a))
  employeeRecipients.forEach(e => combinedMap.set(e.email.toLowerCase(), e))

  return Array.from(combinedMap.values()).filter(r => r.email.toLowerCase() !== currentEmail?.toLowerCase())
}

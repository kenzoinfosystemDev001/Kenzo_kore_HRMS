"use client"

import { useState, useEffect } from "react"
import { apiClient } from "./api-client"

export interface HelpdeskTicketRecord {
  id: string
  subject: string
  category: "Help/Support" | "IT & Tools Requirement" | "Equipment & Hardware" | "Complaint/Grievance" | "Payroll & Salary Issue" | "General Inquiry"
  raisedBy: string
  raisedByEmail: string
  assignedTo: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  description: string
  createdAt: string
}

const STORAGE_KEY = "kenzo_hrms_tickets_store"
const EVENT_NAME = "kenzo_ticket_updated"

export const DEFAULT_TICKETS: HelpdeskTicketRecord[] = [
  {
    id: "TICK-1001",
    subject: "Developer Workstation RAM Upgrade Request",
    category: "IT & Tools Requirement",
    raisedBy: "Sujal Kumar",
    raisedByEmail: "Sujal.kumar@kenzoinfosystems.com",
    assignedTo: "IT Support Team",
    priority: "High",
    status: "In Progress",
    description: "Requesting 16GB additional RAM for local Docker & Next.js HRMS build performance.",
    createdAt: "Aug 10, 2026",
  },
]

export function getStoredTickets(): HelpdeskTicketRecord[] {
  if (typeof window === "undefined") return DEFAULT_TICKETS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as HelpdeskTicketRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  saveStoredTickets(DEFAULT_TICKETS)
  return DEFAULT_TICKETS
}

export function saveStoredTickets(list: HelpdeskTicketRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new Event(EVENT_NAME))
  } catch {
    // Fallback
  }
}

export function addStoredTicket(ticket: HelpdeskTicketRecord) {
  // 1. Send HTTP POST request to NestJS API Backend so ticket is saved in PostgreSQL!
  try {
    apiClient.post('/helpdesk/tickets', {
      subject: ticket.subject,
      category: ticket.category,
      description: ticket.description,
      priority: ticket.priority,
      raisedByEmail: ticket.raisedByEmail,
      raisedByName: ticket.raisedBy,
    }).catch(err => console.warn("Backend API Helpdesk POST handled:", err))
  } catch {
    // API offline fallback
  }

  // 2. Sync client state and broadcast event
  const current = getStoredTickets()
  const updated = [ticket, ...current]
  saveStoredTickets(updated)
  return updated
}

export function updateTicketStatus(id: string, status: HelpdeskTicketRecord["status"]) {
  // 1. Send HTTP PATCH request to NestJS API Backend
  try {
    apiClient.patch(`/helpdesk/tickets/${id}/status`, { status })
      .catch(err => console.warn("Backend API Helpdesk PATCH handled:", err))
  } catch {
    // API offline fallback
  }

  // 2. Sync client state and broadcast event
  const current = getStoredTickets()
  const updated = current.map(t => (t.id === id ? { ...t, status } : t))
  saveStoredTickets(updated)
  return updated
}

export function deleteStoredTicket(id: string) {
  // 1. Send HTTP DELETE request to NestJS API Backend
  try {
    apiClient.delete(`/helpdesk/tickets/${id}`)
      .catch(err => console.warn("Backend API Helpdesk DELETE handled:", err))
  } catch {
    // API offline fallback
  }

  // 2. Sync client state and broadcast event
  const current = getStoredTickets()
  const updated = current.filter(t => t.id !== id)
  saveStoredTickets(updated)
  return updated
}

/**
 * Custom React Hook for real-time Helpdesk ticket synchronization across tabs & dashboards
 */
export function useHelpdeskTickets() {
  const [tickets, setTickets] = useState<HelpdeskTicketRecord[]>(() => getStoredTickets())

  useEffect(() => {
    const handleSync = () => {
      setTickets(getStoredTickets())
    }

    window.addEventListener(EVENT_NAME, handleSync)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(EVENT_NAME, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  return [tickets, setTickets] as const
}

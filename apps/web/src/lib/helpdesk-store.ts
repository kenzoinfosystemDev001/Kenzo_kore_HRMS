"use client"

import { useState, useEffect, useCallback } from "react"
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

export const INITIAL_TICKETS: HelpdeskTicketRecord[] = [
  {
    id: "TICK-1001",
    subject: "Developer Laptop RAM Upgrade Request",
    category: "Equipment & Hardware",
    raisedBy: "Sujal Kumar",
    raisedByEmail: "Sujal.kumar@kenzoinfosystems.com",
    assignedTo: "IT Support Team",
    priority: "High",
    status: "Open",
    description: "Requesting RAM expansion from 16GB to 32GB for local Docker & Kubernetes environment.",
    createdAt: "Aug 10, 2026",
  },
  {
    id: "TICK-1002",
    subject: "VPN Access Configuration Issue",
    category: "IT & Tools Requirement",
    raisedBy: "Chanchal Saini",
    raisedByEmail: "Chanchal.saini@kenzoinfosystems.com",
    assignedTo: "Network Admin",
    priority: "Medium",
    status: "Resolved",
    description: "Configured corporate VPN credentials for remote portal access.",
    createdAt: "Aug 08, 2026",
  },
]

let inMemoryTicketsCache: HelpdeskTicketRecord[] = [...INITIAL_TICKETS]
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchTicketsFromApi(): Promise<HelpdeskTicketRecord[]> {
  try {
    const data = await apiClient.get<HelpdeskTicketRecord[]>('/helpdesk/tickets')
    if (Array.isArray(data)) {
      inMemoryTicketsCache = data
      notifyListeners()
      return data
    }
  } catch (err) {
    console.warn("Error fetching tickets from API:", err)
  }
  return inMemoryTicketsCache
}

export function getStoredTickets(): HelpdeskTicketRecord[] {
  return inMemoryTicketsCache
}

export async function addStoredTicket(ticket: HelpdeskTicketRecord): Promise<HelpdeskTicketRecord[]> {
  // Optimistic UI update so ticket is visible instantly on button click
  inMemoryTicketsCache = [ticket, ...inMemoryTicketsCache.filter(t => t.id !== ticket.id)]
  notifyListeners()

  try {
    await apiClient.post('/helpdesk/tickets', {
      subject: ticket.subject,
      category: ticket.category,
      description: ticket.description,
      priority: ticket.priority,
      raisedByEmail: ticket.raisedByEmail,
      raisedByName: ticket.raisedBy,
    })
    return await fetchTicketsFromApi()
  } catch (err) {
    console.warn("Neon DB API POST helpdesk ticket fallback handled:", err)
    return inMemoryTicketsCache
  }
}

export async function updateTicketStatus(id: string, status: HelpdeskTicketRecord["status"]): Promise<HelpdeskTicketRecord[]> {
  inMemoryTicketsCache = inMemoryTicketsCache.map(t => (t.id === id ? { ...t, status } : t))
  notifyListeners()

  try {
    await apiClient.patch(`/helpdesk/tickets/${id}/status`, { status })
    return await fetchTicketsFromApi()
  } catch (err) {
    console.warn("Neon DB API PATCH handled:", err)
    return fetchTicketsFromApi()
  }
}

export async function deleteStoredTicket(id: string): Promise<HelpdeskTicketRecord[]> {
  inMemoryTicketsCache = inMemoryTicketsCache.filter(t => t.id !== id)
  notifyListeners()

  try {
    await apiClient.delete(`/helpdesk/tickets/${id}`)
    return await fetchTicketsFromApi()
  } catch (err) {
    console.warn("Neon DB API DELETE handled:", err)
    return fetchTicketsFromApi()
  }
}

export function useHelpdeskTickets() {
  const [tickets, setTickets] = useState<HelpdeskTicketRecord[]>(inMemoryTicketsCache)

  const reload = useCallback(() => {
    fetchTicketsFromApi().then(data => {
      setTickets([...data])
    })
  }, [])

  useEffect(() => {
    reload()

    const interval = setInterval(() => {
      fetchTicketsFromApi().then(data => {
        setTickets([...data])
      })
    }, 3000)

    const handleListener = () => {
      setTickets([...inMemoryTicketsCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload])

  return [tickets, setTickets] as const
}

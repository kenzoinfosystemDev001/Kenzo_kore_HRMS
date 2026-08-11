"use client"

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
  } catch {
    // Fallback
  }
}

export function addStoredTicket(ticket: HelpdeskTicketRecord) {
  const current = getStoredTickets()
  const updated = [ticket, ...current]
  saveStoredTickets(updated)
  return updated
}

export function updateTicketStatus(id: string, status: HelpdeskTicketRecord["status"]) {
  const current = getStoredTickets()
  const updated = current.map(t => (t.id === id ? { ...t, status } : t))
  saveStoredTickets(updated)
  return updated
}

export function deleteStoredTicket(id: string) {
  const current = getStoredTickets()
  const updated = current.filter(t => t.id !== id)
  saveStoredTickets(updated)
  return updated
}

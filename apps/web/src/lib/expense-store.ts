"use client"

export interface ExpenseClaimRecord {
  id: string
  employeeName: string
  employeeEmail: string
  category: string
  merchant: string
  date: string
  amount: string
  notes: string
  receiptUrl?: string
  status: "Pending" | "Approved" | "Rejected"
  reviewNotes?: string
}

const STORAGE_KEY = "kenzo_hrms_expense_store"

export const DEFAULT_EXPENSES: ExpenseClaimRecord[] = [
  {
    id: "EXP-2026-801",
    employeeName: "Sujal Kumar",
    employeeEmail: "Sujal.kumar@kenzoinfosystems.com",
    category: "Travel & Transport",
    merchant: "Uber Corporate Fleet",
    date: "Aug 05, 2026",
    amount: "₹1,850",
    notes: "Client meeting travel & site deployment visit.",
    status: "Approved",
  },
  {
    id: "EXP-2026-802",
    employeeName: "Laxmi Narayan",
    employeeEmail: "Laxminarayan.ojha@kenzoinfosystems.com",
    category: "Office Supplies",
    merchant: "Amazon Business",
    date: "Aug 08, 2026",
    amount: "₹3,499",
    notes: "Ergonomic workspace accessories and high-speed cable.",
    status: "Pending",
  },
]

export function getStoredExpenses(): ExpenseClaimRecord[] {
  if (typeof window === "undefined") return DEFAULT_EXPENSES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ExpenseClaimRecord[]
  } catch {
    // Fallback
  }
  return DEFAULT_EXPENSES
}

export function saveStoredExpenses(list: ExpenseClaimRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addExpenseClaim(claim: ExpenseClaimRecord) {
  const current = getStoredExpenses()
  const updated = [claim, ...current]
  saveStoredExpenses(updated)
  return updated
}

export function updateExpenseStatus(id: string, status: "Approved" | "Rejected", notes?: string) {
  const current = getStoredExpenses()
  const updated = current.map(e => (e.id === id ? { ...e, status, reviewNotes: notes } : e))
  saveStoredExpenses(updated)
  return updated
}

export function deleteExpenseClaim(id: string) {
  const current = getStoredExpenses()
  const updated = current.filter(e => e.id !== id)
  saveStoredExpenses(updated)
  return updated
}

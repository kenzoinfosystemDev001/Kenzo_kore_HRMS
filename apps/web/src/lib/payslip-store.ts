"use client"

export interface PayslipRecord {
  id: string
  employeeName: string
  employeeEmail: string
  month: string
  gross: string
  deductions: string
  net: string
  status: string
  date: string
  basicPay: string
  hra: string
  specialAllowance: string
  pfDeduction: string
  tdsDeduction: string
}

const STORAGE_KEY = "kenzo_hrms_payslips_store"

export const DEFAULT_PAYSLIPS: PayslipRecord[] = [
  {
    id: "PAY-2026-0801",
    employeeName: "Sujal Kumar",
    employeeEmail: "employee@kenzo.com",
    month: "July 2026",
    gross: "₹2,37,500",
    deductions: "₹22,500",
    net: "₹2,15,000",
    status: "Paid",
    date: "Aug 01, 2026",
    basicPay: "₹1,20,000",
    hra: "₹60,000",
    specialAllowance: "₹57,500",
    pfDeduction: "₹7,500",
    tdsDeduction: "₹15,000",
  },
  {
    id: "PAY-2026-0802",
    employeeName: "Ankit Sethi",
    employeeEmail: "admin@kenzo.com",
    month: "July 2026",
    gross: "₹4,50,000",
    deductions: "₹45,000",
    net: "₹4,05,000",
    status: "Paid",
    date: "Aug 01, 2026",
    basicPay: "₹2,25,000",
    hra: "₹1,12,500",
    specialAllowance: "₹1,12,500",
    pfDeduction: "₹15,000",
    tdsDeduction: "₹30,000",
  },
]

export function getStoredPayslips(): PayslipRecord[] {
  if (typeof window === "undefined") return DEFAULT_PAYSLIPS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PayslipRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_PAYSLIPS
}

export function saveStoredPayslips(list: PayslipRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addStoredPayslip(slip: PayslipRecord) {
  const current = getStoredPayslips()
  const updated = [slip, ...current]
  saveStoredPayslips(updated)
  return updated
}

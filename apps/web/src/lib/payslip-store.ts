"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "./api-client"

export interface PayslipRecord {
  id: string
  employeeName: string
  employeeEmail: string
  month: string
  basicPay: string
  allowances: string
  deductions: string
  netPay: string
  status: "Paid" | "Processing" | "Pending"
  issuedDate: string
  gross?: string
  net?: string
  date?: string
  hra?: string
  specialAllowance?: string
  pfDeduction?: string
  tdsDeduction?: string
}

export const DEFAULT_PAYSLIPS: PayslipRecord[] = [
  {
    id: "PAY-2026-07-1002",
    employeeName: "Sujal Kumar",
    employeeEmail: "Sujal.kumar@kenzoinfosystems.com",
    month: "July 2026",
    basicPay: "₹75,000",
    allowances: "₹15,000",
    deductions: "₹5,000",
    netPay: "₹85,000",
    gross: "₹90,000",
    net: "₹85,000",
    date: "Aug 01, 2026",
    hra: "₹15,000",
    specialAllowance: "₹10,000",
    pfDeduction: "₹3,000",
    tdsDeduction: "₹2,000",
    status: "Paid",
    issuedDate: "Aug 01, 2026",
  },
  {
    id: "PAY-2026-07-1001",
    employeeName: "Ankit Sethi",
    employeeEmail: "Ankit.sethi@kenzoinfosystems.com",
    month: "July 2026",
    basicPay: "₹1,80,000",
    allowances: "₹40,000",
    deductions: "₹15,000",
    netPay: "₹2,05,000",
    gross: "₹2,20,000",
    net: "₹2,05,000",
    date: "Aug 01, 2026",
    hra: "₹35,000",
    specialAllowance: "₹20,000",
    pfDeduction: "₹8,000",
    tdsDeduction: "₹7,000",
    status: "Paid",
    issuedDate: "Aug 01, 2026",
  },
]

let inMemoryPayslipsCache: PayslipRecord[] = DEFAULT_PAYSLIPS
const LISTENERS = new Set<() => void>()

function notifyListeners() {
  LISTENERS.forEach(cb => cb())
}

export async function fetchPayslipsFromApi(): Promise<PayslipRecord[]> {
  try {
    const data = await apiClient.get<PayslipRecord[]>('/payroll/payslips')
    if (Array.isArray(data) && data.length > 0) {
      inMemoryPayslipsCache = data.map(p => ({
        ...p,
        gross: p.gross || p.basicPay,
        net: p.net || p.netPay,
        date: p.date || p.issuedDate,
      }))
      notifyListeners()
      return inMemoryPayslipsCache
    }
  } catch (err) {
    console.warn("Error fetching payslips from Neon DB API:", err)
  }
  return inMemoryPayslipsCache
}

export function getStoredPayslips(): PayslipRecord[] {
  return inMemoryPayslipsCache
}

export function addStoredPayslip(payslip: Partial<PayslipRecord>): PayslipRecord {
  const newRec: PayslipRecord = {
    id: payslip.id || `PAY-${Date.now()}`,
    employeeName: payslip.employeeName || 'Employee',
    employeeEmail: payslip.employeeEmail || '',
    month: payslip.month || 'Current Month',
    basicPay: payslip.basicPay || '₹85,000',
    allowances: payslip.allowances || '₹15,000',
    deductions: payslip.deductions || '₹5,000',
    netPay: payslip.netPay || payslip.net || '₹95,000',
    status: 'Paid',
    issuedDate: payslip.issuedDate || payslip.date || new Date().toLocaleDateString(),
    gross: payslip.gross || payslip.basicPay || '₹1,00,000',
    net: payslip.net || payslip.netPay || '₹95,000',
    date: payslip.date || payslip.issuedDate || new Date().toLocaleDateString(),
    hra: payslip.hra || '₹15,000',
    specialAllowance: payslip.specialAllowance || '₹10,000',
    pfDeduction: payslip.pfDeduction || '₹3,000',
    tdsDeduction: payslip.tdsDeduction || '₹2,000',
    ...payslip,
  }
  inMemoryPayslipsCache = [newRec, ...inMemoryPayslipsCache]
  notifyListeners()
  return newRec
}

export function usePayslips() {
  const [payslips, setPayslips] = useState<PayslipRecord[]>(inMemoryPayslipsCache)

  const reload = useCallback(() => {
    fetchPayslipsFromApi().then(data => {
      setPayslips([...data])
    })
  }, [])

  useEffect(() => {
    reload()

    const interval = setInterval(() => {
      fetchPayslipsFromApi().then(data => {
        setPayslips([...data])
      })
    }, 3000)

    const handleListener = () => {
      setPayslips([...inMemoryPayslipsCache])
    }

    LISTENERS.add(handleListener)

    return () => {
      clearInterval(interval)
      LISTENERS.delete(handleListener)
    }
  }, [reload])

  return [payslips, setPayslips] as const
}

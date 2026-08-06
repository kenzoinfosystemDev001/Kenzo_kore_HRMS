"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { getStoredPayslips, addStoredPayslip, PayslipRecord } from '../payslip-store'

export function usePayslips() {
  return useQuery({
    queryKey: ['payslips'],
    queryFn: async () => {
      try {
        const data = await apiClient.get<{ data: any[] }>('/payslips')
        return data.data || data
      } catch {
        return getStoredPayslips()
      }
    },
    staleTime: 30000,
  })
}

export function useCreatePayslip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payslip: Partial<PayslipRecord>) => {
      try {
        return await apiClient.post('/payslips', payslip)
      } catch {
        const newPayslip: PayslipRecord = {
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          employeeName: payslip.employeeName || '',
          employeeEmail: payslip.employeeEmail || '',
          month: payslip.month || '',
          gross: payslip.gross || '0',
          deductions: payslip.deductions || '0',
          net: payslip.net || '0',
          status: payslip.status || 'Paid',
          date: payslip.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          basicPay: payslip.basicPay || '0',
          hra: payslip.hra || '0',
          specialAllowance: payslip.specialAllowance || '0',
          pfDeduction: payslip.pfDeduction || '0',
          tdsDeduction: payslip.tdsDeduction || '0',
          ...payslip,
        } as PayslipRecord
        addStoredPayslip(newPayslip)
        return newPayslip
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payslips'] }),
  })
}

"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { getStoredEmployees, addStoredEmployee, updateStoredEmployee, deleteStoredEmployee, EmployeeRecord } from '../employee-store'

// Hybrid hook: tries API first, falls back to localStorage
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const data = await apiClient.get<{ data: any[] }>('/employees')
        return data.data || data
      } catch {
        // Fallback to localStorage if API unavailable
        return getStoredEmployees()
      }
    },
    staleTime: 30000,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (employee: Partial<EmployeeRecord>) => {
      try {
        return await apiClient.post('/employees', employee)
      } catch {
        const newEmp: EmployeeRecord = {
          id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          name: employee.name || '',
          email: employee.email || '',
          password: employee.password,
          role: employee.role || 'Employee',
          dept: employee.dept || 'General',
          status: 'Active',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          ...employee,
        } as EmployeeRecord
        addStoredEmployee(newEmp)
        return newEmp
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeRecord> }) => {
      try {
        return await apiClient.put(`/employees/${id}`, data)
      } catch {
        updateStoredEmployee({ id, ...data } as EmployeeRecord)
        return data
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await apiClient.delete(`/employees/${id}`)
      } catch {
        deleteStoredEmployee(id)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })
}

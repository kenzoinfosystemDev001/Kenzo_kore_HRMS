"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { EmployeeRecord } from '../employee-store'

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const data = await apiClient.get<any>('/employees')
      const list = Array.isArray(data) ? data : data?.data || []
      return list.map((emp: any) => ({
        id: emp.id,
        code: emp.employeeCode || emp.code || `EMP-${emp.id.slice(0, 5)}`,
        name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Employee',
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.workEmail || emp.email || '',
        workEmail: emp.workEmail,
        personalEmail: emp.personalEmail,
        phone: emp.phone,
        workPhone: emp.workPhone,
        role: emp.user?.userRoles?.[0]?.role?.name || emp.role || 'Employee',
        dept: emp.department?.name || emp.dept || 'General',
        departmentId: emp.departmentId,
        designation: emp.designation?.name || emp.designation || 'Staff',
        designationId: emp.designationId,
        status: (emp.employmentStatus || emp.status || 'Active').toLowerCase() === 'active' ? 'Active' : 'Inactive',
        joinDate: emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
        avatar: emp.photoUrl || emp.avatar || '',
        reportingManager: emp.reportingManager?.displayName || (emp.reportingManager ? `${emp.reportingManager.firstName} ${emp.reportingManager.lastName}` : undefined),
        workLocation: emp.workLocation,
        employmentType: emp.employmentType,
      })) as EmployeeRecord[]
    },
    staleTime: 30000,
  })
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (employee: Partial<EmployeeRecord>) => {
      const payload = {
        firstName: employee.firstName || employee.name?.split(' ')[0] || employee.name || 'New',
        lastName: employee.lastName || employee.name?.split(' ').slice(1).join(' ') || 'Employee',
        email: employee.workEmail || employee.email,
        password: employee.password,
        phone: employee.phone,
        departmentId: employee.departmentId,
        designationId: employee.designationId,
        employeeCode: employee.code || employee.employeeCode,
        employmentType: employee.employmentType || 'full_time',
        systemRole: employee.role,
      }
      return await apiClient.post('/employees', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeRecord> }) => {
      return await apiClient.patch(`/employees/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/employees/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { EmployeeRecord } from '../employee-store'

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const data = await apiClient.get<Record<string, unknown>[] | { data: Record<string, unknown>[] }>('/employees')
      const list = Array.isArray(data) ? data : data?.data || []

      return list.map((emp: Record<string, unknown>) => {
        const userObj = emp.user as { userRoles?: { role?: { name?: string } }[] } | undefined
        const deptObj = emp.department as { name?: string } | undefined
        const desigObj = emp.designation as { name?: string } | undefined
        const mgrObj = emp.reportingManager as { displayName?: string; firstName?: string; lastName?: string } | undefined
        const empId = String(emp.id || '')

        return {
          id: empId,
          code: String(emp.employeeCode || emp.code || `EMP-${empId.slice(0, 5)}`),
          name: String(emp.name || `${String(emp.firstName || '')} ${String(emp.lastName || '')}`.trim() || 'Employee'),
          firstName: emp.firstName as string | undefined,
          lastName: emp.lastName as string | undefined,
          email: String(emp.workEmail || emp.email || ''),
          workEmail: emp.workEmail as string | undefined,
          personalEmail: emp.personalEmail as string | undefined,
          phone: emp.phone as string | undefined,
          workPhone: emp.workPhone as string | undefined,
          role: userObj?.userRoles?.[0]?.role?.name || (emp.role as string) || 'Employee',
          dept: deptObj?.name || (emp.dept as string) || 'General',
          departmentId: emp.departmentId as string | undefined,
          designation: desigObj?.name || (emp.designation as string) || 'Staff',
          designationId: emp.designationId as string | undefined,
          status: String(emp.employmentStatus || emp.status || 'Active').toLowerCase() === 'active' ? 'Active' : 'Inactive',
          joinDate: emp.dateOfJoining ? new Date(String(emp.dateOfJoining)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
          avatar: String(emp.photoUrl || emp.avatar || ''),
          reportingManager: mgrObj?.displayName || (mgrObj ? `${mgrObj.firstName || ''} ${mgrObj.lastName || ''}` : undefined),
          workLocation: emp.workLocation as string | undefined,
          employmentType: emp.employmentType as string | undefined,
        }
      }) as EmployeeRecord[]
    },
    refetchInterval: 3000,
    staleTime: 2000,
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

"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { getStoredLeaves, addLeaveRequest, updateLeaveStatus, LeaveRequestRecord } from '../leave-store'

export function useLeaves() {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      try {
        const data = await apiClient.get<{ data: LeaveRequestRecord[] }>('/leaves')
        return data.data || data
      } catch {
        return getStoredLeaves()
      }
    },
    staleTime: 30000,
  })
}

export function useCreateLeave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (leave: Partial<LeaveRequestRecord>) => {
      try {
        return await apiClient.post('/leaves', leave)
      } catch {
        const newLeave: LeaveRequestRecord = {
          id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
          employeeName: leave.employeeName || '',
          employeeEmail: leave.employeeEmail || '',
          leaveType: leave.leaveType || 'Casual Leave',
          days: leave.days || 1,
          startDate: leave.startDate || new Date().toISOString(),
          endDate: leave.endDate || new Date().toISOString(),
          reason: leave.reason || '',
          status: 'Pending',
          appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          ...leave,
        } as LeaveRequestRecord
        addLeaveRequest(newLeave)
        return newLeave
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  })
}

export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "Approved" | "Rejected" }) => {
      try {
        return await apiClient.put(`/leaves/${id}`, { status })
      } catch {
        updateLeaveStatus(id, status)
        return { id, status }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  })
}

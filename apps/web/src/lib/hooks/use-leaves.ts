"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { getStoredLeaves, addLeaveRequest, updateLeaveStatus, LeaveRequestRecord } from '../leave-store'

export function useLeaves() {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: async () => {
      try {
        const data = await apiClient.get<LeaveRequestRecord[]>('/leave/requests')
        return Array.isArray(data) ? data : getStoredLeaves()
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
        return await apiClient.post('/leave/requests', leave)
      } catch {
        const newLeave: LeaveRequestRecord = {
          id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
          employeeName: leave.employeeName || '',
          employeeEmail: leave.employeeEmail || '',
          type: leave.type || leave.leaveType || 'Casual Leave',
          leaveType: leave.leaveType || leave.type || 'Casual Leave',
          days: leave.days || 1,
          startDate: leave.startDate || new Date().toISOString(),
          endDate: leave.endDate || new Date().toISOString(),
          reason: leave.reason || '',
          status: 'Pending',
          appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          ...leave,
        } as LeaveRequestRecord
        await addLeaveRequest(newLeave)
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
        const action = status === "Approved" ? "approve" : "reject"
        return await apiClient.patch(`/leave/requests/${id}/${action}`, {})
      } catch {
        await updateLeaveStatus(id, status)
        return { id, status }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaves'] }),
  })
}

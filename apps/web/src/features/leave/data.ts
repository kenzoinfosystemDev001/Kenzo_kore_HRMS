export const leaveBalances = [
  { id: "lb-1", type: "Annual Leave", allocated: 20, used: 0, pending: 0, available: 20, color: "bg-blue-500" },
  { id: "lb-2", type: "Sick Leave", allocated: 10, used: 0, pending: 0, available: 10, color: "bg-rose-500" },
  { id: "lb-3", type: "Casual Leave", allocated: 7, used: 0, pending: 0, available: 7, color: "bg-amber-500" },
  { id: "lb-4", type: "Maternity/Paternity", allocated: 90, used: 0, pending: 0, available: 90, color: "bg-purple-500" }
];

export const leaveRequests = [
  { id: "req-1", employee: "Sujal Kumar", avatar: "SK", type: "Casual Leave", from: "2026-08-20", to: "2026-08-20", days: 1, status: "Pending", reason: "Personal errand" },
];

export const leaveTypes = [
  { id: "lt-1", name: "Annual Leave", code: "AL", days: 20, isPaid: true, accrual: "Monthly" },
  { id: "lt-2", name: "Sick Leave", code: "SL", days: 10, isPaid: true, accrual: "Yearly" },
  { id: "lt-3", name: "Casual Leave", code: "CL", days: 7, isPaid: true, accrual: "Yearly" },
  { id: "lt-4", name: "Loss of Pay", code: "LOP", days: 0, isPaid: false, accrual: "None" },
  { id: "lt-5", name: "Maternity Leave", code: "ML", days: 90, isPaid: true, accrual: "Event based" },
];

export const myLeaves: { id: string; type: string; from: string; to: string; days: number; status: string; appliedOn: string }[] = [];

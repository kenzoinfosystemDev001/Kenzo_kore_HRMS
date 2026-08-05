export const leaveBalances = [
  { id: "lb-1", type: "Annual Leave", allocated: 20, used: 8, pending: 2, available: 10, color: "bg-blue-500" },
  { id: "lb-2", type: "Sick Leave", allocated: 10, used: 2, pending: 0, available: 8, color: "bg-rose-500" },
  { id: "lb-3", type: "Casual Leave", allocated: 7, used: 7, pending: 0, available: 0, color: "bg-amber-500" },
  { id: "lb-4", type: "Maternity/Paternity", allocated: 90, used: 0, pending: 0, available: 90, color: "bg-purple-500" }
];

export const leaveRequests = [
  { id: "req-1", employee: "Marcus Johnson", avatar: "MJ", type: "Annual Leave", from: "2023-10-15", to: "2023-10-20", days: 5, status: "Pending", reason: "Family vacation" },
  { id: "req-2", employee: "Sarah Chen", avatar: "SC", type: "Sick Leave", from: "2023-10-02", to: "2023-10-03", days: 2, status: "Approved", reason: "Fever" },
  { id: "req-3", employee: "David Wilson", avatar: "DW", type: "Casual Leave", from: "2023-10-10", to: "2023-10-10", days: 1, status: "Pending", reason: "Personal errand" },
  { id: "req-4", employee: "Emily Davis", avatar: "ED", type: "Annual Leave", from: "2023-11-01", to: "2023-11-05", days: 5, status: "Rejected", reason: "Project delivery week" }
];

export const leaveTypes = [
  { id: "lt-1", name: "Annual Leave", code: "AL", days: 20, isPaid: true, accrual: "Monthly" },
  { id: "lt-2", name: "Sick Leave", code: "SL", days: 10, isPaid: true, accrual: "Yearly" },
  { id: "lt-3", name: "Casual Leave", code: "CL", days: 7, isPaid: true, accrual: "Yearly" },
  { id: "lt-4", name: "Loss of Pay", code: "LOP", days: 0, isPaid: false, accrual: "None" },
  { id: "lt-5", name: "Maternity Leave", code: "ML", days: 90, isPaid: true, accrual: "Event based" },
];

export const myLeaves = [
  { id: "my-1", type: "Sick Leave", from: "2023-08-15", to: "2023-08-16", days: 2, status: "Approved", appliedOn: "2023-08-14" },
  { id: "my-2", type: "Annual Leave", from: "2023-06-01", to: "2023-06-05", days: 5, status: "Approved", appliedOn: "2023-05-10" },
  { id: "my-3", type: "Casual Leave", from: "2023-04-12", to: "2023-04-12", days: 1, status: "Approved", appliedOn: "2023-04-10" },
];

# Kenzo HRMS - RBAC Matrix

## Overview
Kenzo HRMS uses a hierarchical Role-Based Access Control (RBAC) system. Permissions are granted to Roles, which are assigned to Users. Role assignments can be scoped globally or limited to specific organizational units (e.g., a specific department or team).

## Scopes
- **Global:** Permission applies to all resources across the entire Tenant.
- **Branch/Location:** Permission applies only to resources within a specific branch.
- **Department:** Permission applies only to resources within a specific department (and its sub-departments).
- **Team:** Permission applies only to a specific team.
- **Self:** Implicit scope; users always have read (and sometimes limited write) access to their own data.

## Defined Roles

1. **Platform Super Admin:** Manages the SaaS platform, billing, and global settings (Internal Kenzo Staff).
2. **Company Admin:** Full access within a specific Tenant.
3. **HR Manager:** Full access to Employee, Recruitment, Attendance, and Leave modules globally.
4. **Recruiter:** Access limited to Job Requisitions, Candidates, and Interviews.
5. **Department Manager:** Read/Approve access to Attendance, Leaves, and Performance for their department.
6. **Team Lead:** Read/Approve access to Attendance, Leaves, and Performance for their direct reports.
7. **Payroll Officer:** Full access to Payroll, Compensation, and relevant Employee financial data.
8. **IT Administrator:** Full access to Asset management and User provisioning.
9. **Employee:** Standard user access (Self scope).

## Permission Matrix

| Module | Action | Company Admin | HR Manager | Dept Manager | Team Lead | Payroll | Employee (Self) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Organization** | View Structure | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | Manage Structure | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Employee** | View Profiles | ✅ | ✅ (All) | ✅ (Dept) | ✅ (Team) | ✅ (All) | ✅ (Self) |
| | Create/Edit | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ (Limited) |
| **Attendance** | View Records | ✅ | ✅ (All) | ✅ (Dept) | ✅ (Team) | ✅ (All) | ✅ (Self) |
| | Approve Regularization | ✅ | ✅ | ✅ (Dept) | ✅ (Team) | ❌ | ❌ |
| | Clock In/Out | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Leave** | View Balances | ✅ | ✅ (All) | ✅ (Dept) | ✅ (Team) | ✅ (All) | ✅ (Self) |
| | Approve Requests | ✅ | ✅ | ✅ (Dept) | ✅ (Team) | ❌ | ❌ |
| | Manage Policies | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Payroll** | View Payslips | ✅ | ❌ | ❌ | ❌ | ✅ (All) | ✅ (Self) |
| | Run Payroll | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| | Edit Salaries | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Recruitment**| Manage Jobs/Candidates| ✅ | ✅ | ✅ (Dept) | ❌ | ❌ | ❌ |
| **Performance**| Manage Cycles | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | Conduct Reviews | ✅ | ✅ | ✅ (Dept) | ✅ (Team) | ❌ | ✅ (Self/Peer)|
| **Assets** | Manage Inventory | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Inheritance Rules
1. **Hierarchical Scope:** A user with a role scoped to Department 'A' automatically gains that role's permissions for all Teams within Department 'A'.
2. **Reporting Line:** Managers implicitly gain 'Read' and 'Approve' permissions over the entities (Leaves, Attendance, Goals) of employees who report directly to them, regardless of explicit role assignment.

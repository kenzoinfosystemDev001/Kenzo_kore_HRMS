"use client"

export interface DepartmentRecord {
  id: string
  name: string
  head: string
  code: string
}

export interface TeamRecord {
  id: string
  name: string
  department: string
  lead: string
}

export interface DesignationRecord {
  id: string
  code: string
  title: string
  jobBand: string
}

const STORAGE_DEPT_KEY = "kenzo_hrms_depts_store_v2"
const STORAGE_TEAM_KEY = "kenzo_hrms_teams_store_v2"
const STORAGE_DESIG_KEY = "kenzo_hrms_desig_store_v2"

export const DEFAULT_DEPARTMENTS: DepartmentRecord[] = [
  { id: "DEP-101", name: "Management", head: "Ankit Sethi", code: "MGMT" },
  { id: "DEP-102", name: "Engineering", head: "Sujal Kumar", code: "ENG" },
  { id: "DEP-103", name: "Human Resources", head: "HR Executive Admin", code: "HR" },
  { id: "DEP-104", name: "Sales & Marketing", head: "Laxmi Narayan", code: "SALES" },
  { id: "DEP-105", name: "Operations & Finance", head: "Chanchal Saini", code: "OPS" },
]

export const DEFAULT_TEAMS: TeamRecord[] = [
  { id: "TEAM-201", name: "Core Architecture & Web Platform", department: "Engineering", lead: "Sujal Kumar" },
  { id: "TEAM-202", name: "Executive Leadership & Operations", department: "Management", lead: "Ankit Sethi" },
  { id: "TEAM-203", name: "Talent Acquisition & Compliance", department: "Human Resources", lead: "HR Executive Admin" },
]

export const DEFAULT_DESIGNATIONS: DesignationRecord[] = [
  { id: "DESIG-301", code: "MGMT-C1", title: "CEO & Founder", jobBand: "C1 (Executive)" },
  { id: "DESIG-302", code: "ENG-L4", title: "Software Engineer", jobBand: "L4 (Principal)" },
  { id: "DESIG-303", code: "ENG-L5", title: "Software Architect", jobBand: "L5 (Architect)" },
  { id: "DESIG-304", code: "HR-L3", title: "HR Executive Admin", jobBand: "L3 (Senior HR)" },
  { id: "DESIG-305", code: "MGMT-C2", title: "Managing Director", jobBand: "C2 (Executive)" },
  { id: "DESIG-306", code: "SALES-L2", title: "Field Sales Executive", jobBand: "L2 (Associate)" },
]

export function getStoredDepartments(): DepartmentRecord[] {
  if (typeof window === "undefined") return DEFAULT_DEPARTMENTS
  try {
    const raw = localStorage.getItem(STORAGE_DEPT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DepartmentRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_DEPARTMENTS
}

export function saveStoredDepartments(list: DepartmentRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_DEPT_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addDepartment(dept: DepartmentRecord) {
  const current = getStoredDepartments()
  const updated = [...current, dept]
  saveStoredDepartments(updated)
  return updated
}

export function deleteDepartment(id: string) {
  const current = getStoredDepartments()
  const updated = current.filter(d => d.id !== id)
  saveStoredDepartments(updated)
  return updated
}

export function getStoredTeams(): TeamRecord[] {
  if (typeof window === "undefined") return DEFAULT_TEAMS
  try {
    const raw = localStorage.getItem(STORAGE_TEAM_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as TeamRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_TEAMS
}

export function saveStoredTeams(list: TeamRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addTeam(team: TeamRecord) {
  const current = getStoredTeams()
  const updated = [...current, team]
  saveStoredTeams(updated)
  return updated
}

export function deleteTeam(id: string) {
  const current = getStoredTeams()
  const updated = current.filter(t => t.id !== id)
  saveStoredTeams(updated)
  return updated
}

export function getStoredDesignations(): DesignationRecord[] {
  if (typeof window === "undefined") return DEFAULT_DESIGNATIONS
  try {
    const raw = localStorage.getItem(STORAGE_DESIG_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DesignationRecord[]
      if (parsed && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback
  }
  return DEFAULT_DESIGNATIONS
}

export function saveStoredDesignations(list: DesignationRecord[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_DESIG_KEY, JSON.stringify(list))
  } catch {
    // Fallback
  }
}

export function addDesignation(desig: DesignationRecord) {
  const current = getStoredDesignations()
  const updated = [...current, desig]
  saveStoredDesignations(updated)
  return updated
}

export function deleteDesignation(id: string) {
  const current = getStoredDesignations()
  const updated = current.filter(d => d.id !== id)
  saveStoredDesignations(updated)
  return updated
}

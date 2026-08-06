"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// ─── User Types ─────────────────────────────────────────────
export type UserRole = "admin" | "employee"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  initials: string
  department: string
  designation: string
  avatar?: string
}

// ─── Hardcoded User Database (production would use API) ─────
const USER_DB: Record<string, { password: string; user: AuthUser }> = {
  "admin@kenzo.com": {
    password: "Admin@123",
    user: {
      id: "EMP-1001",
      name: "Ankit Sethi",
      email: "admin@kenzo.com",
      role: "admin",
      initials: "AS",
      department: "Management",
      designation: "CEO & Founder",
    },
  },
  "employee@kenzo.com": {
    password: "Emp@123",
    user: {
      id: "EMP-1002",
      name: "Sujal Kumar",
      email: "employee@kenzo.com",
      role: "employee",
      initials: "SK",
      department: "Engineering",
      designation: "Software Architect",
    },
  },
}

// ─── Auth Context ───────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "kenzo_hrms_session"
const PUBLIC_PATHS = ["/", "/login"]

// ─── Admin-only sidebar sections ───────────────────────────
export const ADMIN_ONLY_ROUTES = [
  "/employees",
  "/organization",
  "/recruitment",
  "/onboarding",
  "/reports",
  "/settings",
  "/integrations",
  "/audit",
  "/projects",
]

export const EMPLOYEE_ALLOWED_ROUTES = [
  "/dashboard",
  "/attendance",
  "/leave",
  "/performance",
  "/payroll",
]

// ─── Provider ───────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch {
      return null
    }
  })
  const [isLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Route guard: redirect unauthenticated users away from dashboard
  useEffect(() => {
    if (isLoading) return

    const isPublic = PUBLIC_PATHS.includes(pathname)

    if (!user && !isPublic) {
      router.replace("/")
      return
    }

    if (user && isPublic) {
      router.replace("/dashboard")
      return
    }

    // RBAC: Employee cannot access admin-only routes
    if (user && user.role === "employee") {
      const isAdminRoute = ADMIN_ONLY_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
      if (isAdminRoute) {
        router.replace("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      const normalizedEmail = email.toLowerCase().trim()

      // 1. Check static USER_DB (Admin / Sujal Kumar)
      const entry = USER_DB[normalizedEmail]
      if (entry) {
        if (entry.password !== password) {
          return { success: false, error: "Incorrect password. Please try again." }
        }
        setUser(entry.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user))
        return { success: true }
      }

      // 2. Check dynamic employeeStore for newly created employees
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("kenzo_hrms_employees_store")
          if (stored) {
            const list = JSON.parse(stored) as Array<{
              id: string
              name: string
              email: string
              password?: string
              role: string
              dept: string
            }>
            const empMatch = list.find(e => e.email.toLowerCase().trim() === normalizedEmail)
            if (empMatch) {
              const validPass = empMatch.password || "Emp@123"
              if (validPass !== password) {
                return { success: false, error: "Incorrect password. Please try again." }
              }
              const newUser: AuthUser = {
                id: empMatch.id,
                name: empMatch.name,
                email: empMatch.email,
                role: "employee",
                initials: empMatch.name.split(" ").map(n => n[0]).join("").toUpperCase(),
                department: empMatch.dept,
                designation: empMatch.role,
              }
              setUser(newUser)
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
              return { success: true }
            }
          }
        } catch {
          // Fallback
        }
      }

      return { success: false, error: "No account found with this email address." }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    router.replace("/")
  }, [router])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ───────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

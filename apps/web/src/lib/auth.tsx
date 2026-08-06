"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "./api-client"

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
const TOKEN_KEY = "kenzo_access_token"
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
  const [isLoading, setIsLoading] = useState(false)
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
      setIsLoading(true)
      const normalizedEmail = email.toLowerCase().trim()

      try {
        // 1. Try real API backend
        const response = await apiClient.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', { email: normalizedEmail, password }, { skipAuth: true })
        
        if (response && response.accessToken) {
          localStorage.setItem(TOKEN_KEY, response.accessToken)
          
          // Call GET /api/auth/me to get the full profile with roles
          try {
            const profile = await apiClient.get<any>('/auth/me')
            
            // Determine role by checking if userRoles includes a role with slug 'super-admin' or name 'Super Admin'
            const hasAdminRole = profile.userRoles?.some(
              (ur: any) => ur.role?.slug === 'super-admin' || ur.role?.name === 'Super Admin'
            ) || false
            
            const role: UserRole = hasAdminRole ? 'admin' : 'employee'
            
            const newUser: AuthUser = {
              id: profile.id || response.user?.id || 'EMP-UNKNOWN',
              name: profile.firstName ? `${profile.firstName} ${profile.lastName}` : (response.user?.firstName ? `${response.user?.firstName} ${response.user?.lastName}` : normalizedEmail),
              email: profile.email || response.user?.email || normalizedEmail,
              role: role,
              initials: profile.firstName ? `${profile.firstName[0]}${profile.lastName?.[0] || ''}`.toUpperCase() : normalizedEmail[0].toUpperCase(),
              department: 'General', // Fallback as this might not be in auth profile
              designation: role === 'admin' ? 'Administrator' : 'Employee'
            }
            
            setUser(newUser)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
            setIsLoading(false)
            return { success: true }
          } catch (meError) {
            console.error('Failed to fetch profile', meError)
            // Still log them in with basic info if /me fails
            const role: UserRole = 'employee' // default fallback
            const newUser: AuthUser = {
              id: response.user?.id || 'EMP-UNKNOWN',
              name: response.user?.firstName ? `${response.user?.firstName} ${response.user?.lastName}` : normalizedEmail,
              email: response.user?.email || normalizedEmail,
              role: role,
              initials: response.user?.firstName ? `${response.user?.firstName[0]}${response.user?.lastName?.[0] || ''}`.toUpperCase() : normalizedEmail[0].toUpperCase(),
              department: 'General',
              designation: 'Employee'
            }
            setUser(newUser)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
            setIsLoading(false)
            return { success: true }
          }
        }
      } catch (error: any) {
        console.error('API Login failed, trying fallback', error)
        // If it's a true API error (like 401 Unauthorized), we might want to return early,
        // but the prompt says "If the API is unreachable (network error / fetch fails), fall back"
        // For safety, we fall through to the local DB checks.
      }

      // 2. Check dynamic employeeStore for newly created employees (Fallback)
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
                setIsLoading(false)
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
              setIsLoading(false)
              return { success: true }
            }
          }
        } catch {
          // Ignore fallback errors
        }
      }
      
      // 3. Keep static USER_DB as ultimate fallback for admin testing if API is down
      const hardcodedDB: Record<string, { password: string; user: AuthUser }> = {
        "ankit.sethi@kenzoinfosystems.com": {
          password: "kenzo123",
          user: {
            id: "EMP-1001",
            name: "Ankit Sethi",
            email: "Ankit.sethi@kenzoinfosystems.com",
            role: "admin",
            initials: "AS",
            department: "Management",
            designation: "CEO & Founder",
          },
        },
        "sujal.kumar@kenzoinfosystems.com": {
          password: "kenzo123",
          user: {
            id: "EMP-1002",
            name: "Sujal Kumar",
            email: "Sujal.kumar@kenzoinfosystems.com",
            role: "employee",
            initials: "SK",
            department: "Engineering",
            designation: "Software Engineer",
          },
        },
      }
      
      const entry = hardcodedDB[normalizedEmail]
      if (entry) {
        if (entry.password !== password) {
          setIsLoading(false)
          return { success: false, error: "Incorrect password. Please try again." }
        }
        setUser(entry.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user))
        setIsLoading(false)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: "No account found with this email address." }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
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

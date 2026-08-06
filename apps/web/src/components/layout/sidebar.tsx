"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  Wallet,
  Receipt,
  UserPlus,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Laptop,
  FolderKanban,
  HeadphonesIcon,
  BarChart3,
  Settings,
  Boxes,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth, EMPLOYEE_ALLOWED_ROUTES } from "@/lib/auth"

const navGroups = [
  {
    title: "WORKFORCE",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Employees", href: "/employees", icon: Users },
      { title: "Organization", href: "/organization", icon: Building2 },
      { title: "Attendance", href: "/attendance", icon: Clock },
      { title: "Leave Management", href: "/leave", icon: CalendarDays },
      { title: "Payroll", href: "/payroll", icon: Wallet },
      { title: "Expense", href: "/expense", icon: Receipt },
    ],
  },
  {
    title: "TALENT",
    items: [
      { title: "Recruitment", href: "/recruitment", icon: UserPlus },
      { title: "Onboarding", href: "/onboarding", icon: Briefcase },
      { title: "Performance", href: "/performance", icon: TrendingUp },
      { title: "Training & LMS", href: "/training", icon: GraduationCap },
    ],
  },
  {
    title: "ASSETS & OPERATIONS",
    items: [
      { title: "Assets", href: "/assets", icon: Laptop },
      { title: "Projects", href: "/projects", icon: FolderKanban },
      { title: "Helpdesk", href: "/helpdesk", icon: HeadphonesIcon },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { title: "Reports & Analytics", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Integrations", href: "/integrations", icon: Boxes },
      { title: "Audit Logs", href: "/audit", icon: ShieldCheck },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { user, isAdmin } = useAuth()

  const filteredGroups = navGroups.map(group => {
    return {
      ...group,
      items: group.items.filter(item => {
        if (isAdmin) return true;
        return EMPLOYEE_ALLOWED_ROUTES.includes(item.href);
      })
    }
  }).filter(group => group.items.length > 0)

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-slate-800/80 bg-[#050913] text-slate-100 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 font-extrabold text-white text-lg tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 text-white font-black shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              K
            </div>
            <span>Kenzo<span className="text-blue-500 font-normal">HRMS</span></span>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 font-black text-white shadow-md">
            K
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3.5 top-4 h-7 w-7 rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-md hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* Navigation Group Stream */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        {filteredGroups.map((group, i) => (
          <div key={i} className="mb-5 px-3">
            {!collapsed && (
              <h4 className="mb-2 px-3 text-[10px] font-extrabold tracking-[1.5px] text-slate-400 uppercase flex items-center justify-between">
                <span>{group.title}</span>
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}`))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10 font-semibold"
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:border-slate-800 border border-transparent"
                    )}
                  >
                    <item.icon
                      size={17}
                      className={cn(isActive ? "text-blue-400 shrink-0" : "text-slate-400 shrink-0")}
                    />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Toggle */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/60 flex flex-col gap-2">
        {user && (
          <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50", collapsed ? "justify-center" : "")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-slate-200 truncate">{user.name}</span>
                <span className="text-[10px] text-slate-500 truncate capitalize">{user.role.toLowerCase()}</span>
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-xs text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl",
            collapsed ? "px-0 justify-center" : ""
          )}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
          {!collapsed && <span className="ml-2.5">Switch Theme</span>}
        </Button>
      </div>
    </motion.aside>
  )
}

"use client"

import * as React from "react"
import { useState } from "react"
import { Sidebar, SidebarContent } from "./sidebar"
import { Header } from "./header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Sheet Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Drawer Panel */}
          <div className="relative z-10 w-72 h-full max-w-[80vw] shadow-2xl">
            <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-3 sm:p-5 md:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}

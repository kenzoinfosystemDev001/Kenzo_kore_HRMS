"use client"

import * as React from "react"
import { Bell, MessageSquare, Search, Plus, Sparkles, ShieldCheck } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card/80 backdrop-blur-xl px-6 z-20">
      <div className="flex w-full max-w-md items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, payroll, attendance, AI insights..."
            className="w-full bg-muted/40 border-border pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary rounded-xl"
          />
          <kbd className="pointer-events-none absolute right-3 top-2.5 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs hidden sm:flex items-center gap-1.5 py-1 px-3">
          <ShieldCheck className="h-3.5 w-3.5" /> Kenzo Cloud Active
        </Badge>

        <Button size="sm" className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20 rounded-xl">
          <Plus size={15} />
          Quick Action
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
          <MessageSquare size={19} />
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
          <Bell size={19} />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-blue-500 ring-2 ring-card" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/30 hover:ring-primary">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="@admin" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">SK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border text-card-foreground" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground">Sujal Kumar</p>
                <p className="text-xs text-muted-foreground font-mono">
                  admin@kenzo.com
                </p>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 text-[10px] mt-1">Super Admin</Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Company Configuration</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

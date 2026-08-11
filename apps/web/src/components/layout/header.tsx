"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  MessageSquare,
  Search,
  Plus,
  ShieldCheck,
  CalendarDays,
  Receipt,
  Award,
  Clock,
  HelpCircle,
  Send,
  UserCheck,
  CheckCheck,
  Lock,
  Menu,
} from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import {
  getStoredMessages,
  sendChatMessage,
  getAvailableChatRecipients,
  getUnreadMessagesCount,
  markMessagesAsRead,
  ChatMessage,
} from "@/lib/message-store"
import {
  getNotificationsForUser,
  markNotificationAsRead,
  UserNotification,
} from "@/lib/notification-store"

export function Header({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  // Chat Modal State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredMessages())
  
  // Available recipients (If employee, return all Admin & HR Leadership accounts)
  const availableRecipients = getAvailableChatRecipients(isAdmin, user?.email)
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState<string>(
    () => availableRecipients[0]?.email || "Ankit.sethi@kenzoinfosystems.com"
  )
  const [messageInput, setMessageInput] = useState("")

  // Unread messages count for logged-in user
  const unreadMessagesCount = getUnreadMessagesCount(user?.email)

  // Notifications State
  const userNotifications: UserNotification[] = getNotificationsForUser(user?.email || "")
  const unreadCount = userNotifications.filter(n => !n.isRead).length

  const handleOpenChat = (open: boolean) => {
    setIsChatOpen(open)
    if (open && user?.email) {
      const updated = markMessagesAsRead(user.email, selectedRecipientEmail)
      setMessages(updated)
    }
  }

  const handleSelectRecipient = (email: string) => {
    setSelectedRecipientEmail(email)
    if (user?.email) {
      const updated = markMessagesAsRead(user.email, email)
      setMessages(updated)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !user?.email) return

    const recipientObj = availableRecipients.find(r => r.email === selectedRecipientEmail) || {
      email: selectedRecipientEmail,
      name: "Admin",
    }

    const updated = sendChatMessage({
      senderEmail: user.email,
      senderName: user.name || "Employee",
      recipientEmail: recipientObj.email,
      recipientName: recipientObj.name,
      content: messageInput.trim(),
    })

    setMessages(updated)
    setMessageInput("")
  }

  // Filter messages for current conversation thread
  const conversationMessages = messages.filter(
    m =>
      (m.senderEmail.toLowerCase() === user?.email?.toLowerCase() && m.recipientEmail.toLowerCase() === selectedRecipientEmail.toLowerCase()) ||
      (m.senderEmail.toLowerCase() === selectedRecipientEmail.toLowerCase() && m.recipientEmail.toLowerCase() === user?.email?.toLowerCase())
  )

  const handleMarkAllNotifications = () => {
    userNotifications.forEach(n => markNotificationAsRead(n.id))
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card/80 backdrop-blur-xl px-3 sm:px-6 z-20 gap-2">
      {/* Left Mobile Menu Toggle + Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {onMobileMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="md:hidden text-foreground hover:bg-muted shrink-0"
            aria-label="Toggle Mobile Navigation Menu"
          >
            <Menu size={20} />
          </Button>
        )}

        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search HRMS..."
            className="w-full bg-muted/40 border-border pl-9 pr-4 sm:pr-12 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary rounded-xl"
          />
          <kbd className="pointer-events-none absolute right-3 top-2.5 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right Header Action Icons */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs hidden lg:flex items-center gap-1.5 py-1 px-3 font-semibold">
          <ShieldCheck className="h-3.5 w-3.5" /> Kenzo Cloud Active
        </Badge>

        {/* 1. Quick Action Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 rounded-xl text-xs">
              <Plus size={15} />
              <span>Quick Action</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border text-card-foreground" align="end">
            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shortcuts & Workflows</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-medium text-xs flex items-center gap-2" onClick={() => router.push("/leave")}>
              <CalendarDays className="h-4 w-4 text-indigo-500" /> Apply for Leave
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-xs flex items-center gap-2" onClick={() => router.push("/expense")}>
              <Receipt className="h-4 w-4 text-emerald-500" /> Submit Expense Claim
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-xs flex items-center gap-2" onClick={() => router.push("/performance")}>
              <Award className="h-4 w-4 text-amber-500" /> Request Appraisal / Promotion
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-xs flex items-center gap-2" onClick={() => router.push("/attendance")}>
              <Clock className="h-4 w-4 text-blue-500" /> Mark Attendance (Clock In)
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium text-xs flex items-center gap-2" onClick={() => router.push("/helpdesk")}>
              <HelpCircle className="h-4 w-4 text-rose-500" /> Submit Helpdesk Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Chat / Message Dialog */}
        <Dialog open={isChatOpen} onOpenChange={handleOpenChat}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all h-9 w-9 ${
                unreadMessagesCount > 0 ? "animate-bounce text-rose-500 bg-rose-500/10" : ""
              }`}
              title="Admin Direct Chat"
            >
              <MessageSquare size={18} className={unreadMessagesCount > 0 ? "text-rose-500" : ""} />
              {unreadMessagesCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white ring-2 ring-card shadow-lg">
                  {unreadMessagesCount}
                </span>
              ) : (
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-xl max-h-[85vh] flex flex-col justify-between p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-foreground font-extrabold text-base sm:text-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" /> Direct Executive Messenger
                </span>
                {!isAdmin && (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-bold hidden sm:flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Admin & HR Chat Only
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {!isAdmin 
                  ? "Employees can communicate directly with HR Administrators and Executive Leadership." 
                  : "Admin Executive Communications Center."}
              </DialogDescription>
            </DialogHeader>

            {/* Recipient Selection Bar */}
            <div className="space-y-1.5 py-2 border-b border-border">
              <Label className="text-xs font-bold text-muted-foreground">Select Chat Recipient ({!isAdmin ? "Admins & HR Leadership" : "All Employees"}):</Label>
              <Select value={selectedRecipientEmail} onValueChange={handleSelectRecipient}>
                <SelectTrigger className="w-full bg-background font-bold text-xs">
                  <SelectValue placeholder="Choose HR / Admin..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRecipients.map(r => (
                    <SelectItem key={r.email} value={r.email}>
                      {r.name} ({r.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chat Conversation Window */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4 my-2 rounded-xl border bg-muted/20 max-h-[350px]">
              {conversationMessages.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <UserCheck className="h-8 w-8 text-blue-500/40" />
                  <span>No prior chat history with selected contact. Send a message to start conversation.</span>
                </div>
              ) : (
                conversationMessages.map((msg) => {
                  const isMe = msg.senderEmail.toLowerCase() === user?.email?.toLowerCase()
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold mb-1">
                        <span>{msg.senderName}</span>
                        <span>• {msg.timestamp}</span>
                      </div>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs font-medium ${isMe ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" : "bg-card border text-foreground rounded-tl-none"}`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-border">
              <Input
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="text-xs bg-background text-foreground"
                required
              />
              <Button type="submit" size="sm" className="bg-primary font-bold px-3 sm:px-4 text-xs">
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Notifications Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-9 w-9" title="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-card">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 sm:w-80 bg-card border-border text-card-foreground p-2" align="end">
            <div className="flex items-center justify-between px-2 py-1 border-b pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Notifications ({userNotifications.length})</span>
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={handleMarkAllNotifications} className="h-6 text-[10px] text-blue-500 font-bold px-1.5">
                  <CheckCheck className="h-3 w-3 mr-1" /> Mark Read
                </Button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 py-2">
              {userNotifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">No new notifications.</div>
              ) : (
                userNotifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors ${n.isRead ? "bg-card border-border opacity-75" : "bg-primary/10 border-primary/30"}`}>
                    <div className="font-bold text-foreground flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{n.date}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 4. User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/30 hover:ring-primary p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt={`@${user?.name || 'user'}`} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">{user?.initials || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border text-card-foreground" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {user?.email}
                </p>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 text-[10px] mt-1 capitalize font-bold">
                  {isAdmin ? 'Admin' : 'Employee'}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-bold text-foreground" onClick={() => router.push(`/employees/${encodeURIComponent(user?.email || user?.id || 'EMP-1002')}`)}>
              My Profile Settings
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                Company Configuration
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer font-bold" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

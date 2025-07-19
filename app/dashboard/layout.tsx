"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Home,
  BookOpen,
  Folder,
  Calendar,
  BarChart2,
  Settings,
  Brain,
  FileText,
  Bell,
  User,
  LogOut,
  NotebookPen,
  Network,
  Megaphone,
  Handshake,
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAethonOpen, setIsAethonOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/projects', icon: Folder, label: 'Projects' },
    { href: '/personal-notes', icon: NotebookPen, label: 'Personal Notes' },
    { href: '/files', icon: FileText, label: 'Files' },
    { href: '/citations', icon: BookOpen, label: 'Citations' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/collaboration', icon: Handshake, label: 'Collaboration' },
    { href: '/community', icon: Network, label: 'Community' },
    { href: '/analytics', icon: BarChart2, label: 'Analytics' },
    { href: '/aethon', icon: Brain, label: 'Aethon AI' },
    { href: '/publish', icon: Megaphone, label: 'Publish Paper' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  const bottomNavItems = [
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/logout', icon: LogOut, label: 'Logout' },
  ]

  return (
    <TooltipProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex h-full max-h-screen flex-col gap-4">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link className="flex items-center gap-3 font-semibold" href="/">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  The Research Hub
                </span>
              </Link>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8 bg-transparent">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 py-4">
              <nav className="grid items-start px-4 text-sm font-medium">
                \

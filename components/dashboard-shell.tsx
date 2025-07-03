"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  FileText,
  FolderOpen,
  Brain,
  Calendar,
  Settings,
  User,
  LogOut,
  Menu,
  FolderKanban,
  BookMarked,
  Users,
  Send,
  BarChart,
  UserPlus,
  Globe,
  Home,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { EnhancedAethonAssistant } from "@/components/enhanced-aethon-assistant"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [open, setOpen] = useState(false)
  const [showAethon, setShowAethon] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      title: "Research Notes",
      href: "/notes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Personal Notes",
      href: "/personal-notes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Files",
      href: "/files",
      icon: <FolderOpen className="h-5 w-5" />,
    },
    {
      title: "Citations",
      href: "/citations",
      icon: <BookMarked className="h-5 w-5" />,
    },
    {
      title: "Timeline",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart className="h-5 w-5" />,
    },
  ]

  const communityItems = [
    {
      title: "Community",
      href: "/community",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Collaboration",
      href: "/collaboration",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Publish Paper",
      href: "/publish",
      icon: <Send className="h-5 w-5" />,
    },
  ]

  const getCurrentContext = () => {
    if (pathname.includes('/notes')) return 'notes'
    if (pathname.includes('/files')) return 'files'
    if (pathname.includes('/projects')) return 'projects'
    if (pathname.includes('/community')) return 'community'
    if (pathname.includes('/publish')) return 'publish'
    if (pathname.includes('/citations')) return 'citations'
    if (pathname.includes('/calendar')) return 'calendar'
    return undefined
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold px-4 py-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg">Research Hub</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Research Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Community</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {communityItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/aethon"}>
                      <Link href="/aethon">
                        <Brain className="h-5 w-5" />
                        <span>Aethon Chat</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setShowAethon(!showAethon)}>
                      <Brain className="h-5 w-5" />
                      <span>Quick Assist</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="container flex h-16 items-center justify-between px-4">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] pr-0">
                  <div className="flex items-center gap-2 font-semibold mb-8">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-lg">Research Hub</span>
                  </div>
                  <nav className="flex flex-col gap-2 pr-6">
                    {[...navItems, ...communityItems].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg">Research Hub</span>
              </Link>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAethon(!showAethon)}
                >
                  <Brain className="h-5 w-5" />
                  <span className="sr-only">Aethon Assistant</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Researcher</p>
                        <p className="text-xs leading-none text-muted-foreground">researcher@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowAethon(!showAethon)}
                >
                  <Brain className="h-5 w-5" />
                  <span className="sr-only">Aethon Assistant</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>RS</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Researcher</p>
                        <p className="text-xs leading-none text-muted-foreground">researcher@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="flex flex-1">
            <main className="flex-1 container py-6">{children}</main>

            {/* Aethon Assistant Sidebar */}
            {showAethon && (
              <div className="w-80 border-l bg-muted/20 p-4 hidden lg:block">
                <EnhancedAethonAssistant 
                  context={getCurrentContext()}
                  onSuggestion={(suggestion) => {
                    console.log("Aethon suggestion:", suggestion)
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile Aethon Assistant */}
          {showAethon && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="fixed right-0 top-0 h-full w-full max-w-sm border-l bg-background p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Aethon Assistant</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowAethon(false)}>
                    <span className="sr-only">Close</span>
                    ×
                  </Button>
                </div>
                <EnhancedAethonAssistant 
                  context={getCurrentContext()}
                  onSuggestion={(suggestion) => {
                    console.log("Aethon suggestion:", suggestion)
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}
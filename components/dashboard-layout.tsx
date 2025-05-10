"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, BarChart3, Trophy, LogOut, Settings, FileText, Users, PlusCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "student" | "admin"
  userName?: string
}

export default function DashboardLayout({
  children,
  userRole = "student",
  userName = "Student",
}: DashboardLayoutProps) {
  const pathname = usePathname()

  const studentMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Available Tests", href: "/dashboard/tests", icon: FileText },
    { name: "My Scores", href: "/dashboard/scores", icon: BarChart3 },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  ]

  const adminMenuItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Manage Tests", href: "/admin/tests", icon: FileText },
    { name: "Manage Questions", href: "/admin/questions", icon: PlusCircle },
    { name: "Students", href: "/admin/students", icon: Users },
    
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]

  const menuItems = userRole === "admin" ? adminMenuItems : studentMenuItems

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-3">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">MockExam</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{userName}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex w-full items-center">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex w-full items-center">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout" className="flex w-full items-center text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={userRole === "admin" ? "/admin/help" : "/dashboard/help"}>Help</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Home,
  BarChart3,
  LogOut,
  Settings,
  FileText,
  Users,
  GraduationCap,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AdminDashboardLayoutProps {
  children: React.ReactNode
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Categories", href: "/admin/Categories", icon: BookOpen },
    { name: "Exams", href: "/admin/exams", icon: FileText },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-3">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">MockExam Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full pl-8 text-sm" />
              </div>
            </div>
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
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">Admin User</div>
              </div>
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                      <Bell className="h-4 w-4" />
                      <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        3
                      </Badge>
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between p-2">
                      <p className="font-medium">Notifications</p>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                        Mark all as read
                      </Button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="flex w-full items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <Users className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New student registration</p>
                            <p className="text-xs text-muted-foreground">Sarah Lee has joined the platform</p>
                          </div>
                          <p className="text-xs text-muted-foreground">2h ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="flex w-full items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Exam needs review</p>
                            <p className="text-xs text-muted-foreground">Logic Assessment awaiting approval</p>
                          </div>
                          <p className="text-xs text-muted-foreground">5h ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start p-3">
                        <div className="flex w-full items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                            <BarChart3 className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Monthly report ready</p>
                            <p className="text-xs text-muted-foreground">April 2023 report is available</p>
                          </div>
                          <p className="text-xs text-muted-foreground">1d ago</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t p-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href="/admin/profile" className="flex w-full items-center">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/admin/settings" className="flex w-full items-center">
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
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content — min-w-0 prevents overflow under sidebar */}
        <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
  <SidebarTrigger className="shrink-0" />
  <div className="ml-auto flex items-center gap-4">
    <Button variant="outline" size="sm" asChild>
      <Link href="/admin/help">
        <HelpCircle className="mr-2 h-4 w-4" />
        Help
      </Link>
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
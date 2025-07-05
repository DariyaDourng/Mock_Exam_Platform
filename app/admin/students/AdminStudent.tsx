'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Calendar, BookOpen } from "lucide-react"
import axios from "axios"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([
    { 
      id: 1,
      name: 'Dourng Dariya',
      email: 'dariyaduong1008@gmail.com',
      courses: '1',
      exams: 1,
      avgScore: 85,
      lastActive: '2025-06-01',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jeong Jaehyun',
      email: 'dariyadourng1002@gmail.com',
      courses: '2',
      exams: 1,
      avgScore: 92,
      lastActive: '2025-05-29',
      status: 'inactive',
    },
    // Add more static student data here
  ]) // Static data instead of fetching from API
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (score >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Students</h1>
          <p className="text-muted-foreground">View and manage student accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Add Student</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Students</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search students..." className="w-[250px] pl-8" />
            </div>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Exams Taken</TableHead>
                <TableHead>Avg. Score</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{student.courses}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.exams}</TableCell>
                  <TableCell>
                    <Badge className={getScoreBadge(student.avgScore)}>{student.avgScore}%</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(student.lastActive).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Exam History</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {student.status === "active" ? "Deactivate Account" : "Activate Account"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

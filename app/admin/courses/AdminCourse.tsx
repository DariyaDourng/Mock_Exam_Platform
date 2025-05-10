"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, MoreHorizontal, Plus, Search, Users, Calendar, Clock } from "lucide-react"
import { AddCourseModal } from "@/components/modals/add-course-modal"
import { EditCourseModal } from "@/components/modals/edit-course-modal"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function AdminCoursesPage() {
  const { toast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)

  // Mock data
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Math Fundamentals",
      category: "Math",
      students: 45,
      exams: 3,
      createdAt: "2023-05-01",
      status: "active",
    },
    {
      id: 2,
      name: "Logic IQ Test",
      category: "Logic IQ",
      students: 38,
      exams: 2,
      createdAt: "2023-04-28",
      status: "active",
    },
    {
      id: 3,
      name: "Advanced Mathematics",
      category: "Math",
      students: 27,
      exams: 4,
      createdAt: "2023-04-15",
      status: "draft",
    },
    {
      id: 4,
      name: "Critical Thinking",
      category: "Logic IQ",
      students: 32,
      exams: 3,
      createdAt: "2023-04-10",
      status: "active",
    },
    {
      id: 5,
      name: "Algebra Basics",
      category: "Math",
      students: 41,
      exams: 2,
      createdAt: "2023-04-05",
      status: "active",
    },
  ])

  const handleAddCourse = (courseData: any) => {
    // In a real app, you would call an API to add the course
    const newCourse = {
      id: courses.length + 1,
      name: courseData.name,
      category: courseData.category,
      students: 0,
      exams: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: courseData.isActive ? "active" : "draft",
    }

    setCourses([newCourse, ...courses])

    toast({
      title: "Course created",
      description: `${courseData.name} has been successfully created.`,
    })
  }

  const handleEditCourse = (courseData: any) => {
    // In a real app, you would call an API to update the course
    const updatedCourses = courses.map((course) =>
      course.id.toString() === courseData.id
        ? {
            ...course,
            name: courseData.name,
            category: courseData.category,
            status: courseData.isActive ? "active" : "draft",
          }
        : course,
    )

    setCourses(updatedCourses)

    toast({
      title: "Course updated",
      description: `${courseData.name} has been successfully updated.`,
    })
  }

  const openEditModal = (course: any) => {
    setSelectedCourse(course)
    setIsEditModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="text-muted-foreground">Create, edit, and manage your courses</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Course
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Courses</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="w-[250px] pl-8" />
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
                <TableHead>Category</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.exams}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(course)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/courses/${course.id}/exams`}>Manage Exams</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/courses/${course.id}/students`}>View Students</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Course Modal */}
      <AddCourseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddCourse} />

      {/* Edit Course Modal */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCourse}
        courseData={selectedCourse}
      />
    </div>
  )
}

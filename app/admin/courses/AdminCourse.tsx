'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus, Search, Users, Calendar, Clock } from "lucide-react"
import { AddCourseModal } from "@/components/modals/add-course-modal"
import { EditCourseModal } from "@/components/modals/edit-course-modal"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { DeleteCourseModal } from "@/components/modals/delete-course-modal"
import { useRouter } from "next/navigation"

export default function AdminCoursesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setCourses(data.data || [])
      } else {
        throw new Error("Failed to fetch subjects")
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const openDeleteModal = (id: string) => {
    setSelectedCourseId(id)
    setIsModalOpen(true)
  }

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return
    try {
      const response = await fetch(`http://localhost:8000/api/subjects/${selectedCourseId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete course")
      }
      toast({
        title: "Course deleted",
        description: "The course was deleted successfully.",
      })
      setIsModalOpen(false)
      fetchSubjects()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleAddCourse = async (courseData: any) => {
    try {
      const formData = new FormData()
      formData.append("name", courseData.name || "")
      formData.append("description", courseData.description || "")
      formData.append("is_active", courseData.isActive ? "1" : "0")
      if (courseData.image) {
        formData.append("subject_image", courseData.image)
      }

      const response = await fetch("http://localhost:8000/api/subjects", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("Raw Response Body:", errorText)
        throw new Error("Failed to create course")
      }

      toast({
        title: "Course created",
        description: `${courseData.name} has been successfully created.`,
      })

      fetchSubjects()
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding course:", error)
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive"
      })
    }
  }

  const handleEditCourse = async (courseData: any) => {
    try {
      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("name", courseData.name || "")
      formData.append("description", courseData.description || "")
      formData.append("is_active", courseData.isActive ? "1" : "0")
      if (courseData.image) {
        formData.append("subject_image", courseData.image)
      }

      const response = await fetch(`http://localhost:8000/api/subjects/${courseData.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("Raw Response Body:", errorText)
        throw new Error("Failed to update course")
      }

      toast({
        title: "Course updated",
        description: `${courseData.name} has been successfully updated.`,
      })

      fetchSubjects()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive"
      })
    }
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
            <Button variant="outline" size="sm">Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
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
                      <span><img width={50} height={50} src={course.subject_image} /></span>
                      <span className="text-[16px] font-medium">{course.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><p className="text-sm ">{course.description}</p></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{course.students || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.exams || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.is_active ? "active" : "draft")}</TableCell>
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
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(course.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                     
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCourse}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCourse}
        courseData={selectedCourse}
      />

       <DeleteCourseModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        courseId={selectedCourseId}
                        onDeleted={handleDeleteCourse}
                      />
    </div>
  )
}

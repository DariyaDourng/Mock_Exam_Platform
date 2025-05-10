"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, MoreHorizontal, Plus, Search, BookOpen, Calendar, Clock, Users, HelpCircle } from "lucide-react"
import { AddExamModal } from "@/components/modals/add-exam-modal"
import { EditExamModal } from "@/components/modals/edit-exam-modal"
import { useToast } from "@/components/ui/use-toast"

export default function AdminExamsPage() {
  const { toast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<any>(null)

  // Mock data
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Math Midterm",
      course: "Math Fundamentals",
      questions: 30,
      duration: 45,
      submissions: 42,
      avgScore: 76,
      dueDate: "2023-05-15",
      status: "active",
    },
    {
      id: 2,
      name: "Logic Assessment",
      course: "Logic IQ Test",
      questions: 25,
      duration: 30,
      submissions: 35,
      avgScore: 81,
      dueDate: "2023-05-20",
      status: "active",
    },
    {
      id: 3,
      name: "Advanced Calculus",
      course: "Advanced Mathematics",
      questions: 40,
      duration: 60,
      submissions: 0,
      avgScore: 0,
      dueDate: "2023-06-01",
      status: "draft",
    },
    {
      id: 4,
      name: "Critical Reasoning",
      course: "Critical Thinking",
      questions: 35,
      duration: 45,
      submissions: 30,
      avgScore: 79,
      dueDate: "2023-05-10",
      status: "completed",
    },
    {
      id: 5,
      name: "Algebra Quiz",
      course: "Algebra Basics",
      questions: 20,
      duration: 25,
      submissions: 38,
      avgScore: 83,
      dueDate: "2023-05-05",
      status: "completed",
    },
  ])

  const handleAddExam = (examData: any) => {
    // In a real app, you would call an API to add the exam
    const newExam = {
      id: exams.length + 1,
      name: examData.name,
      course: examData.course ? getCourseNameById(examData.course) : "",
      questions: Number.parseInt(examData.questions),
      duration: Number.parseInt(examData.duration),
      submissions: 0,
      avgScore: 0,
      dueDate: examData.dueDate ? examData.dueDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      status: examData.isActive ? "active" : "draft",
    }

    setExams([newExam, ...exams])

    toast({
      title: "Exam created",
      description: `${examData.name} has been successfully created.`,
    })
  }

  const handleEditExam = (examData: any) => {
    // In a real app, you would call an API to update the exam
    const updatedExams = exams.map((exam) =>
      exam.id.toString() === examData.id
        ? {
            ...exam,
            name: examData.name,
            course: examData.course ? getCourseNameById(examData.course) : exam.course,
            questions: Number.parseInt(examData.questions),
            duration: Number.parseInt(examData.duration),
            dueDate: examData.dueDate ? examData.dueDate.toISOString().split("T")[0] : exam.dueDate,
            status: examData.isActive ? "active" : "draft",
          }
        : exam,
    )

    setExams(updatedExams)

    toast({
      title: "Exam updated",
      description: `${examData.name} has been successfully updated.`,
    })
  }

  const openEditModal = (exam: any) => {
    setSelectedExam(exam)
    setIsEditModalOpen(true)
  }

  // Helper function to get course name by ID
  const getCourseNameById = (id: string) => {
    const courses = [
      { id: "1", name: "Math Fundamentals" },
      { id: "2", name: "Logic IQ Test" },
      { id: "3", name: "Advanced Mathematics" },
      { id: "4", name: "Critical Thinking" },
      { id: "5", name: "Algebra Basics" },
    ]

    const course = courses.find((c) => c.id === id)
    return course ? course.name : ""
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Exams</h1>
            <p className="text-muted-foreground">Create, edit, and manage your exams</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Exam
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Exams</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search exams..." className="w-[250px] pl-8" />
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
                  <TableHead>Course</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.course}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.questions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.submissions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.avgScore > 0 ? (
                        <Badge
                          className={
                            exam.avgScore >= 80
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : exam.avgScore >= 70
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {exam.avgScore}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(exam.dueDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(exam)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/exams/${exam.id}/questions`}>Manage Questions</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/exams/${exam.id}/results`}>View Results</Link>
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
      </div>

      {/* Add Exam Modal */}
      <AddExamModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddExam} />

      {/* Edit Exam Modal */}
      <EditExamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditExam}
        examData={selectedExam}
      />
    </div>
  )
}

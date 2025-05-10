"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Eye, HelpCircle, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { QuestionModal } from "@/components/modals/question-modal"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ExamQuestionsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const examId = params.id

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock exam data
  const [exam, setExam] = useState({
    id: examId,
    name: "Math Midterm",
    course: "Math Fundamentals",
    questions: 5,
    duration: 45,
    status: "active",
  })

  // Mock questions data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What is the result of 15 × 7?",
      options: [
        { id: "a", text: "95" },
        { id: "b", text: "105" },
        { id: "c", text: "115" },
        { id: "d", text: "125" },
      ],
      correctAnswer: "b",
      type: "multiple-choice",
    },
    {
      id: 2,
      text: "Solve for x: 3x + 7 = 22",
      options: [
        { id: "a", text: "x = 3" },
        { id: "b", text: "x = 5" },
        { id: "c", text: "x = 7" },
        { id: "d", text: "x = 9" },
      ],
      correctAnswer: "b",
      type: "multiple-choice",
    },
    {
      id: 3,
      text: "What is the area of a rectangle with length 12 cm and width 8 cm?",
      options: [
        { id: "a", text: "20 cm²" },
        { id: "b", text: "40 cm²" },
        { id: "c", text: "96 cm²" },
        { id: "d", text: "120 cm²" },
      ],
      correctAnswer: "c",
      type: "multiple-choice",
    },
    {
      id: 4,
      text: "If a = 5 and b = 3, what is the value of a² - b²?",
      options: [
        { id: "a", text: "8" },
        { id: "b", text: "16" },
        { id: "c", text: "22" },
        { id: "d", text: "25" },
      ],
      correctAnswer: "b",
      type: "multiple-choice",
    },
    {
      id: 5,
      text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
      options: [
        { id: "a", text: "24" },
        { id: "b", text: "30" },
        { id: "c", text: "32" },
        { id: "d", text: "36" },
      ],
      correctAnswer: "c",
      type: "multiple-choice",
    },
  ])

  // Filter questions based on search query
  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddQuestion = (questionData: any) => {
    // In a real app, you would call an API to add the question
    const newQuestion = {
      id: questions.length + 1,
      text: questionData.text,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      type: questionData.type,
    }

    setQuestions([...questions, newQuestion])

    // Update exam question count
    setExam((prev) => ({
      ...prev,
      questions: prev.questions + 1,
    }))

    toast({
      title: "Question added",
      description: "The question has been successfully added to the exam.",
    })
  }

  const handleEditQuestion = (questionData: any) => {
    // In a real app, you would call an API to update the question
    const updatedQuestions = questions.map((question) =>
      question.id.toString() === questionData.id
        ? {
            ...question,
            text: questionData.text,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            type: questionData.type,
          }
        : question,
    )

    setQuestions(updatedQuestions)

    toast({
      title: "Question updated",
      description: "The question has been successfully updated.",
    })
  }

  const handleDeleteQuestion = () => {
    if (!selectedQuestion) return

    // In a real app, you would call an API to delete the question
    const updatedQuestions = questions.filter((question) => question.id !== selectedQuestion.id)

    setQuestions(updatedQuestions)

    // Update exam question count
    setExam((prev) => ({
      ...prev,
      questions: prev.questions - 1,
    }))

    setIsDeleteDialogOpen(false)
    setSelectedQuestion(null)

    toast({
      title: "Question deleted",
      description: "The question has been successfully deleted.",
    })
  }

  const openEditModal = (question: any) => {
    setSelectedQuestion(question)
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (question: any) => {
    setSelectedQuestion(question)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Manage Questions</h1>
            <p className="text-muted-foreground">
              {exam.name} • {exam.questions} questions • {exam.duration} minutes
            </p>
          </div>
          <div className="ml-auto">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Questions</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions..."
                  className="w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[50%]">Question</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No questions match your search." : "No questions found. Add your first question."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{question.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="line-clamp-2">{question.text}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        Option {question.correctAnswer.toUpperCase()}:{" "}
                        {question.options.find((opt) => opt.id === question.correctAnswer)?.text}
                      </TableCell>
                      <TableCell className="capitalize">{question.type.replace("-", " ")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(question)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(question)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(question)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(question)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Question Modal */}
      <QuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddQuestion}
        examId={examId}
        examName={exam.name}
      />

      {/* Edit Question Modal */}
      <QuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditQuestion}
        examId={examId}
        examName={exam.name}
        questionData={selectedQuestion}
        isEditing={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this question. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

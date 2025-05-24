"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MoreHorizontal, Plus, Search, Edit, Eye, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionModal } from "@/components/modals/question-modal"
import { useToast } from "@/components/ui/use-toast"
import { DeleteQuestionModal } from "@/components/modals/delete-question-modal"

export default function QuestionBankPage() {
  const { toast } = useToast()

  const [questions, setQuestions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | number | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const openDeleteModal = (id: string | number) => {
    setSelectedQuestionId(id)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedQuestionId(null)
  }

  const handleDeleted = async () => {
    await fetchQuestions()
  }

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("http://localhost:8000/api/questions")
      const data = res.data

      const questionsArray = Array.isArray(data)
        ? data
        : data.questions || data.data || []

      const mappedQuestions = questionsArray.map((q: any) => {
        let correctIndex = -1
        const options = (q.choices || []).map((choice: any, idx: number) => {
          if (choice.is_correct) correctIndex = idx
          return { id: String.fromCharCode(97 + idx), text: choice.choice_text }
        })

        return {
          id: q.id,
          text: q.question_text,
          subject: q.subject_name || "Uncategorized",
          type: q.type,
          options,
          correctAnswer: correctIndex !== -1 ? String.fromCharCode(97 + correctIndex) : "a",
          usedIn: q.used_in_subjects || [],
        }
      })

      setQuestions(mappedQuestions)
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load questions from the server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const filteredQuestions = questions.filter(
    (question) =>
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (subjectFilter === "all" || question.subject === subjectFilter),
  )

  const subjects = ["all", ...Array.from(new Set(questions.map((q) => q.subject)))]

  const openEditModal = (questionId: string | number) => {
    setSelectedQuestionId(questionId)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">Manage and reuse questions across multiple subjects</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Questions</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === "all" ? "All Categories" : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {isLoading ? (
            <p className="text-center py-10">Loading questions...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[40%]">Question</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery || subjectFilter !== "all"
                        ? "No questions match your search criteria."
                        : "No questions found. Add your first question."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question, index) => (
                    <TableRow key={question.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="line-clamp-2">{question.text}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{question.subject}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{question.type.replace("-", " ")}</TableCell>
                      <TableCell>
                        {question.options.find((opt: { id: string; text: string }) => opt.id === question.correctAnswer)?.text ||
                          question.correctAnswer}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(question.id)}>
                            <Edit className="h-4 w-4 text-indigo-500" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(question.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
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
                              <DropdownMenuItem onClick={() => openEditModal(question.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteModal(question.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Exam
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
          )}
        </CardContent>
      </Card>

      {/* Add Question Modal */}
      <QuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitSuccess={() => {
          fetchQuestions()
          toast({
            title: "Success",
            description: "Question added successfully.",
          })
        }}
      />

      {/* Edit Question Modal */}
      <QuestionModal
        isOpen={isEditModalOpen}
        questionId={selectedQuestionId ?? undefined}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedQuestionId(null)
        }}
        onSubmitSuccess={() => {
          fetchQuestions()
          toast({
            title: "Success",
            description: "Question updated successfully.",
          })
        }}
      />

      {/* Delete Question Modal */}
      <DeleteQuestionModal
        isOpen={deleteModalOpen}
        questionId={selectedQuestionId !== null ? String(selectedQuestionId) : null}
        onClose={closeDeleteModal}
        onDeleted={handleDeleted}
      />
    </div>
  )
}

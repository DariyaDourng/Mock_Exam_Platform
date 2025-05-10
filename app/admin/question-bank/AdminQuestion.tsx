"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MoreHorizontal, Plus, Search, Edit, Eye, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionModal } from "@/components/modals/question-modal"
import { useToast } from "@/components/ui/use-toast"

export default function QuestionBankPage() {
  const { toast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Mock data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What is the result of 15 × 7?",
      category: "Math",
      type: "multiple-choice",
      options: [
        { id: "a", text: "95" },
        { id: "b", text: "105" },
        { id: "c", text: "115" },
        { id: "d", text: "125" },
      ],
      correctAnswer: "b",
      usedIn: ["Math Fundamentals", "Algebra Basics"],
    },
    {
      id: 2,
      text: "Solve for x: 3x + 7 = 22",
      category: "Math",
      type: "multiple-choice",
      options: [
        { id: "a", text: "x = 3" },
        { id: "b", text: "x = 5" },
        { id: "c", text: "x = 7" },
        { id: "d", text: "x = 9" },
      ],
      correctAnswer: "b",
      usedIn: ["Math Fundamentals"],
    },
    {
      id: 3,
      text: "What is the area of a rectangle with length 12 cm and width 8 cm?",
      category: "Math",
      type: "multiple-choice",
      options: [
        { id: "a", text: "20 cm²" },
        { id: "b", text: "40 cm²" },
        { id: "c", text: "96 cm²" },
        { id: "d", text: "120 cm²" },
      ],
      correctAnswer: "c",
      usedIn: ["Math Fundamentals", "Geometry Basics"],
    },
    {
      id: 4,
      text: "If a = 5 and b = 3, what is the value of a² - b²?",
      category: "Math",
      type: "multiple-choice",
      options: [
        { id: "a", text: "8" },
        { id: "b", text: "16" },
        { id: "c", text: "22" },
        { id: "d", text: "25" },
      ],
      correctAnswer: "b",
      usedIn: ["Advanced Mathematics"],
    },
    {
      id: 5,
      text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
      category: "Logic IQ",
      type: "multiple-choice",
      options: [
        { id: "a", text: "24" },
        { id: "b", text: "30" },
        { id: "c", text: "32" },
        { id: "d", text: "36" },
      ],
      correctAnswer: "c",
      usedIn: ["Logic IQ Test", "Pattern Recognition"],
    },
    {
      id: 6,
      text: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
      category: "Logic IQ",
      type: "multiple-choice",
      options: [
        { id: "a", text: "Yes, definitely" },
        { id: "b", text: "No, definitely not" },
        { id: "c", text: "Maybe, but we need more information" },
        { id: "d", text: "The conclusion is irrelevant to the premises" },
      ],
      correctAnswer: "c",
      usedIn: ["Critical Thinking"],
    },
    {
      id: 7,
      text: "The Earth revolves around the Sun.",
      category: "Science",
      type: "true-false",
      options: [
        { id: "a", text: "True" },
        { id: "b", text: "False" },
      ],
      correctAnswer: "a",
      usedIn: ["Science Basics"],
    },
  ])

  // Filter questions based on search query and category
  const filteredQuestions = questions.filter(
    (question) =>
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter === "all" || question.category === categoryFilter),
  )

  const handleAddQuestion = (questionData: any) => {
    // In a real app, you would call an API to add the question
    const newQuestion = {
      id: questions.length + 1,
      text: questionData.text,
      category: "Math", // Default category, would be selected in the modal
      type: questionData.type,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      usedIn: [],
    }

    setQuestions([...questions, newQuestion])

    toast({
      title: "Question added",
      description: "The question has been successfully added to the question bank.",
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

  const openEditModal = (question: any) => {
    setSelectedQuestion(question)
    setIsEditModalOpen(true)
  }

  const handleDeleteQuestion = (id: number) => {
    // In a real app, you would call an API to delete the question
    setQuestions(questions.filter((question) => question.id !== id))

    toast({
      title: "Question deleted",
      description: "The question has been successfully deleted from the question bank.",
    })
  }

  // Get unique categories for the filter
  const categories = ["all", ...new Set(questions.map((q) => q.category))]

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground">Manage and reuse questions across multiple exams</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Questions</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[40%]">Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery || categoryFilter !== "all"
                        ? "No questions match your search criteria."
                        : "No questions found. Add your first question."}
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
                        <Badge variant="outline">{question.category}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{question.type.replace("-", " ")}</TableCell>
                      <TableCell>
                        {question.options.find((opt) => opt.id === question.correctAnswer)?.text ||
                          question.correctAnswer}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(question)}>
                            <Edit className="h-4 w-4 text-indigo-500" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
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
                              <DropdownMenuItem onClick={() => openEditModal(question)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteQuestion(question.id)}>
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
          </CardContent>
        </Card>
      </div>

      {/* Add Question Modal */}
      <QuestionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddQuestion} />

      {/* Edit Question Modal */}
      <QuestionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditQuestion}
        questionData={selectedQuestion}
        isEditing={true}
      />
    </div>
  )
}

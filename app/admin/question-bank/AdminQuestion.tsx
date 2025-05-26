"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionModal } from "@/components/modals/question-modal";
import { DeleteQuestionModal } from "@/components/modals/delete-question-modal";
import { UpdateQuestionModal } from "@/components/modals/UpdateQuestionModal";
import { toast } from "react-hot-toast";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch questions from API
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/questions");
      const data = res.data;

      const questionsArray = Array.isArray(data)
        ? data
        : data.questions || data.data || [];

      const mappedQuestions = questionsArray.map((q: any) => {
        const options = (q.choices || []).map((choice: any, idx: number) => ({
          id: idx + 1,
          text: choice.choice_text,
          isCorrect: choice.is_correct,
        }));

        const correctAnswerOption = options.find((opt) => opt.isCorrect);
        const correctAnswerId = correctAnswerOption ? correctAnswerOption.id : 1;

        return {
          id: q.id,
          text: q.question_text, // may be null for image questions
          questionImage: q.question_image, // image url or object
          format: q.format || "text", // "text" or "image"
          subject: q.subject_name || "Uncategorized",
          type: q.type,
          options,
          points: q.points || 1,
          correctAnswer: correctAnswerId.toString(),
          usedIn: q.used_in_subjects || [],
        };
      });

      setQuestions(mappedQuestions);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load questions from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions by search and subject
  const filteredQuestions = questions.filter((question) => {
    // Use question.text if exists, else empty string
    const searchableText = typeof question.text === "string" ? question.text : "";

    // Check if matches search query (case insensitive)
    const matchesSearch = searchableText.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if matches subject filter
    const matchesSubject = subjectFilter === "all" || question.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  const subjects = ["all", ...Array.from(new Set(questions.map((q) => q.subject)))];

  // Open edit modal and set selected question ID
  const openEditModal = (questionId: string | number) => {
    console.log("Edit button clicked for ID:", questionId);
    setSelectedQuestionId(questionId);
    setIsEditModalOpen(true);
  };

  // Close edit modal and clear selected question ID
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestionId(null);
  };

  // Delete modal open/close handlers
  const openDeleteModal = (id: string | number) => {
    setSelectedQuestionId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQuestionId(null);
  };

  // Handle successful deletion: refetch and notify
  const handleDeleted = async () => {
    await fetchQuestions();
    toast.success("Question deleted successfully");
  };

  // Handle successful add or edit: refetch and notify
  const handleSaveSuccess = () => {
    fetchQuestions();
  };

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
                  <TableHead className="w-[80px]">Points</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                          {question.format === "text" && question.text ? (
                            <span className="line-clamp-2">{question.text}</span>
                          ) : question.format === "image" && question.questionImage ? (
                            <img
                              src={
                                typeof question.questionImage === "string"
                                  ? question.questionImage
                                  : question.questionImage.url
                              }
                              alt={`Question ${question.id} image`}
                              className="max-h-16 rounded"
                            />
                          ) : (
                            <span className="italic text-sm text-muted-foreground">
                              [No Question Text]
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{question.subject}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{question.type.replace("-", " ")}</TableCell>
                      <TableCell>{question.points}</TableCell>
                      <TableCell>
{(() => {
  const correctOptions = question.options.filter(opt => opt.isCorrect);

  if (correctOptions.length === 0) return "None";

  // Join all correct option texts with commas
  return correctOptions.map(opt => opt.text).join(", ");
})()}

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
        onSave={() => {
          fetchQuestions();
          toast.success("Question added successfully.");
        }}
        mode="add"
      />

      {/* Update Question Modal */}
      <UpdateQuestionModal
        isOpen={isEditModalOpen}
        questionId={selectedQuestionId ?? undefined}
        onClose={closeEditModal}
        onSubmitSuccess={handleSaveSuccess}
      />

      {/* Delete Question Modal */}
      <DeleteQuestionModal
        isOpen={deleteModalOpen}
        questionId={selectedQuestionId !== null ? String(selectedQuestionId) : null}
        onClose={closeDeleteModal}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

export default function QuestionBankPage() {
  const router = useRouter();

  const handleAddToExam = (question: any) => {
    if (!question || !question.id) return;
    router.push(`/admin/exams/question/${question.id}`);
  };
  const handlePreviewClick = (question: any) => {
    if (!question || !question.id) return;
    router.push(`/admin/question-bank/${question.id}`);
  };

  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Customize items per page

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL+"/api/questions");
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
          text: q.question_text,
          questionImage: q.question_image,
          format: q.format || "text",
          category: q.category_name || "Uncategorized",
          type: q.type,
          options,
          points: q.points || 1,
          correctAnswer: correctAnswerId.toString(),
          usedIn: q.used_in_categories || [],
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

  // Filter questions by search and category
  const filteredQuestions = questions.filter((question) => {
    const searchableText = typeof question.text === "string" ? question.text : "";
    const matchesSearch = searchableText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || question.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const categories = ["all", ...Array.from(new Set(questions.map((q) => q.category)))];

  const openEditModal = (questionId: string | number) => {
    setSelectedQuestionId(questionId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedQuestionId(null);
  };

  const openDeleteModal = (id: string | number) => {
    setSelectedQuestionId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQuestionId(null);
  };

  const handleDeleted = async () => {
    await fetchQuestions();
    toast.success("Question deleted successfully");
  };

  const handleSaveSuccess = () => {
    fetchQuestions();
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground">
            Manage and reuse questions across multiple categories
          </p>
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
          {isLoading ? (
            <p className="text-center py-10">Loading questions...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="font-bold text-indigo-600">
                    <TableHead className="w-[50px] font-bold text-black">ID</TableHead>
                    <TableHead className="w-[40%] font-bold text-black">Question</TableHead>
                    <TableHead className="font-bold text-black">Category</TableHead>
                    <TableHead className="font-bold text-black">Type</TableHead>
                    <TableHead className="w-[80px] font-bold text-black">Points</TableHead>
                    <TableHead className="font-bold text-black">Correct Answer</TableHead>
                    <TableHead className="w-[150px] font-bold text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchQuery || categoryFilter !== "all"
                          ? "No questions match your search criteria."
                          : "No questions found. Add your first question."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedQuestions.map((question, index) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-bold">{startIndex + index + 1}</TableCell>
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
                          <Badge variant="outline" className="text-indigo-500">{question.category}</Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {question.type.replace("-", " ")}
                        </TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell className="text-green-500 font-bold">
                          {(() => {
                            const correctOptions = question.options.filter(
                              (opt) => opt.isCorrect
                            );

                            if (correctOptions.length === 0) return "None";

                            return correctOptions.map((opt) => opt.text).join(", ");
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreviewClick(question)}
                              aria-label="Preview"
                            >
                              <Eye className="h-4 w-4 text-indigo-600" />
                            </Button>
                            {/* Uncomment if Add to Exam needed
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAddToExam(question)}
                              aria-label="Add to Exam"
                            >
                              <Plus className="h-4 w-4 text-green-600" />
                            </Button>
                            */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(question.id)}
                              aria-label="Edit"
                            >
                              <Edit className="h-4 w-4 text-indigo-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteModal(question.id)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
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

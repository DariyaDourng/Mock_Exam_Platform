"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

interface Question {
  id: number;
  question_text: string | null;
  question_image?: string | null;
  category_name?: string; // Directly retrieving the category_name
  type?: string;
  points?: number;
  format?: string;
}

export default function AddQuestionsToExam({ examId }: { examId: number }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );

  const itemsPerPage = 10; // Customize items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch questions related to the current exam
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await axios.get(API_URL + `/api/exams/${examId}/questions`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setQuestions(data); // Set questions related to the specific exam
      } catch (error) {
        toast.error("Failed to load questions");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [examId]);

  // Filter questions based on search query
  const filteredQuestions = questions.filter((question) => {
    const searchableText =
      typeof question.question_text === "string" ? question.question_text : "";
    return searchableText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper function to render question image
  const renderQuestionImage = (imageUrl: string | null) => {
    if (!imageUrl) return null;

    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : API_URL + `/storage/${imageUrl}`;
    return (
      <img
        src={fullImageUrl}
        alt="Question Image"
        className="max-h-16 rounded"
      />
    );
  };

  // Handle Preview button click
  const handlePreviewClick = (q: Question) => {
    if (!q || !q.id) return;
    router.push(`/admin/question-bank/${q.id}`); // Using 'q' here to access the question data
  };

  // Pagination calculation
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Questions for Exam #{examId}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search questions..."
                className="w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 text-muted-foreground" />
              {/* <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button> */}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center py-10">Loading questions...</p>
          ) : paginatedQuestions.length === 0 ? (
            <p className="text-center py-10">
              No questions found for this exam.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead className="w-[40%]">Question</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[80px]">Points</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuestions.map((q, i) => (
                  <TableRow key={q.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {q.format === "text" && q.question_text ? (
                        <span className="line-clamp-2">{q.question_text}</span>
                      ) : q.format === "image" && q.question_image ? (
                        renderQuestionImage(q.question_image)
                      ) : (
                        <span className="italic text-sm text-muted-foreground">
                          [No Question Text]
                        </span>
                      )}
                    </TableCell>
                    {/* Directly use category_name */}
                    <TableCell>{q.category_name || "No category"}</TableCell>
                    <TableCell>{q.type}</TableCell>
                    <TableCell>{q.points || 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Preview Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewClick(q)} // Pass the correct question object
                          aria-label="Preview"
                        >
                          <Eye className="h-4 w-4 text-indigo-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

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
        </CardContent>
      </Card>
    </div>
  );
}

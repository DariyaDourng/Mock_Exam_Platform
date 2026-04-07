"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  List,
} from "lucide-react";
import { ExamModal } from "@/components/modals/exam-modal";
import { DeleteExamModal } from "@/components/modals/delete-exam-modal";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

export default function AdminExamsPage() {
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [Categories, setCourses] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Fetch exams from API
  const fetchExams = async () => {
    try {
      const response = await axios.get(API_URL + "/api/exams");
      setExams(response.data.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams.");
    }
  };

  // Fetch Categories (categories) from API
  const fetchCourses = async () => {
    try {
      const response = await axios.get(API_URL + "/api/categories");
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Categories:", error);
      toast.error("Failed to fetch Categories.");
    }
  };

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const openEditModal = (exam: any) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setSelectedExamId(id);
    setIsDeleteModalOpen(true);
  };

  const handleAddExam = async (examData: any) => {
    try {
      await axios.post(API_URL + "/api/exams", {
        name: examData.name,
        category_id: examData.category,
        description: examData.description,
        duration: examData.duration,
        created_at: examData.createdAt,
        total_questions: examData.questions,
        passing_score: examData.passingScore,
        is_active: examData.isActive ? "1" : "0",
      });
      toast.success("Exam successfully created.");
      setIsAddModalOpen(false);
      fetchExams();
    } catch (error) {
      console.error("Error adding exam:", error);
      toast.error("Failed to create exam.");
    }
  };

  const handleEditExam = async (examData: any) => {
    try {
      await axios.put(API_URL + `/api/exams/${examData.id}`, {
        name: examData.name,
        category_id: examData.category,
        description: examData.description,
        duration: examData.duration,
        total_questions: examData.questions,
        passing_score: examData.passingScore,
        is_active: examData.isActive ? "1" : "0",
      });
      toast.success("Exam successfully updated.");
      setIsEditModalOpen(false);
      fetchExams();
    } catch (error) {
      console.error("Error updating exam:", error);
      toast.error("Failed to update exam.");
    }
  };

  const handleDeleteExam = async () => {
    if (!selectedExamId) return;
    try {
      await axios.delete(API_URL + `/api/exams/${selectedExamId}`);
      toast.success("Exam successfully deleted.");
      setIsDeleteModalOpen(false);
      setSelectedExamId(null);
      fetchExams();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete exam.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Exams</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your exams
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Exam
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Exams</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exams..."
                className="w-[250px] pl-8"
              />
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
                <TableHead>Description</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[155px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No exams yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Get started by creating your first exam
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>{exam.description}</TableCell>
                    <TableCell>{exam.category_name || "-"}</TableCell>
                    <TableCell>{exam.total_questions}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>
                      {new Date(exam.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(exam.is_active ? "active" : "draft")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/exams/${exam.id}/questions`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Manage Questions"
                          >
                            <Eye className="h-4 w-4 text-indigo-600" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit Exam"
                          onClick={() => openEditModal(exam)}
                        >
                          <Edit className="h-4 w-4 text-indigo-500" />
                        </Button>

                        {/* <Link href={`/admin/exams/${exam.id}/results`} passHref legacyBehavior>
                          <Button
                            as="a"
                            variant="ghost"
                            size="icon"
                            aria-label="View Results"
                          >
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                        </Link> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete Exam"
                          onClick={() => openDeleteModal(exam.id)}
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
        </CardContent>
      </Card>

      <ExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExam}
        Categories={Categories}
      />

      <ExamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditExam}
        examData={selectedExam}
        Categories={Categories}
      />

      <DeleteExamModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        examId={selectedExamId}
        onDeleted={handleDeleteExam}
      />
    </div>
  );
}

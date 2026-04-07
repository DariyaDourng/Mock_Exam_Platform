"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { AddCourseModal } from "@/components/modals/add-category-modal";
import { EditCourseModal } from "@/components/modals/edit-category-modal";
import toast from "react-hot-toast";
import Link from "next/link";
import { DeleteCourseModal } from "@/components/modals/delete-category-modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [Categories, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Fetch categories with students count and exam count
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL + "/api/categories");
      const categories = response.data.data || [];

      // Fetching student count and exam count for each category
      const updatedCategories = await Promise.all(
        categories.map(async (category: any) => {
          const studentCountResponse = await axios.get(
            API_URL + `/api/categories/${category.id}/student-and-exam-count`,
          );

          const { student_count, exam_count } = studentCountResponse.data
            .data || { student_count: 0, exam_count: 0 };

          return {
            ...category,
            students_count: student_count,
            exams_count: exam_count,
          };
        }),
      );

      setCourses(updatedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedCourseId(id);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.delete(API_URL + `/api/categories/${selectedCourseId}`);
      toast.success("Category successfully deleted");
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCourse = async (courseData: any) => {
    try {
      const formData = new FormData();
      formData.append("name", courseData.name || "");
      formData.append("description", courseData.description || "");
      formData.append("is_active", courseData.isActive ? "1" : "0");
      if (courseData.image) {
        formData.append("category_image", courseData.image);
      }

      await axios.post(API_URL + "/api/categories", formData, {
        headers: { Accept: "application/json" },
      });

      toast.success("Category successfully created.");
      fetchCategories();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to create category.");
    }
  };

  const handleEditCourse = async (courseData
    
    : any) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", courseData.name || "");
      formData.append("description", courseData.description || "");
      formData.append("is_active", courseData.isActive ? "1" : "0");
      if (courseData.image) {
        formData.append("category_image", courseData.image);
      }

      await axios.post(API_URL + `/api/categories/${courseData.id}`, formData, {
        headers: { Accept: "application/json" },
      });

      toast.success("Category successfully updated.");
      fetchCategories();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category.");
    }
  };

  const openEditModal = (category: any) => {
    setSelectedCourse(category);
    setIsEditModalOpen(true);
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
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your categories
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Category</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
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
                <TableHead className="font-bold text-black">Name</TableHead>
                <TableHead className="font-bold text-black">Description</TableHead>
                <TableHead className="font-bold text-black">Students</TableHead>
                <TableHead className="font-bold text-black">Exams</TableHead>
                <TableHead className="font-bold text-black">Created</TableHead>
                <TableHead className="font-bold text-black">Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No categories yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Get started by creating your first category
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                Categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img
                          width={50}
                          height={50}
                          src={category.imageUrl}
                          alt="Course"
                        />
                        <span className="text-[16px] font-medium">
                          {category.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{category.description}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{category.students_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{category.exams_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(category.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(category.is_active ? "active" : "draft")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditModal(category)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/Categories/${category.id}/exams`}>
                              Manage Exams
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/Categories/${category.id}/students`}>
                              View Students
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteModal(category.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
  );
}

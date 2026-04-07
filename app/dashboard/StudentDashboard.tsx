"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Cookies from "js-cookie";
import { Search, Calendar, Clock, Target, Eye, BarChart3 } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/config";

interface RawExamData {
  id: number;
  exam_id: number;
  user_id: number;
  date_time_taken: string;
  date_time_finish: string;
  duration_minutes: number;
  duration_seconds: number;
  score: string;
  total_scores: string;
  status: string;
  created_at: string;
  updated_at: string;
  exam?: {
    id: number;
    name: string;
    category_id: number;
    description: string | null;
    duration: number;
    total_questions: number;
    is_active: number;
    created_at: string;
    updated_at: string;
  };
}

interface RawCategoryData {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface ExamAttempt {
  id: string;
  examAttemptId: number;
  rawScore: number;
  examTitle: string;
  category: string;
  attemptNumber: number;
  score: number;
  totalPoints: number;
  percentage: number;
  status: "completed" | "in-progress" | "not-started";
  timeSpent: string;
  completedAt: string;
  passed: boolean;
}

export default function StudentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategoriesMap, setAllCategoriesMap] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesRes = await axios.get(API_URL + "/api/categories", {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
        });
        
        const categoriesData: RawCategoryData[] = categoriesRes.data.data || [];
        const categoriesMap: Record<number, string> = categoriesData.reduce(
          (acc, category) => {
            acc[category.id] = category.name;
            return acc;
          },
          {} as Record<number, string>,
        );
        setAllCategoriesMap(categoriesMap);

        const examRes = await axios.get(
          API_URL + "/api/student/exam-attempts",
          {
            headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
          },
        );
        const rawData: RawExamData[] = examRes.data;

        const attemptsGrouped = rawData.reduce<Record<number, RawExamData[]>>(
          (acc, curr) => {
            if (!acc[curr.exam_id]) acc[curr.exam_id] = [];
            acc[curr.exam_id].push(curr);
            return acc;
          },
          {},
        );

        const formatted: ExamAttempt[] = [];

        Object.values(attemptsGrouped).forEach((attempts) => {
          const sortedAttempts = attempts.sort(
            (a, b) =>
              new Date(a.date_time_finish).getTime() -
              new Date(b.date_time_finish).getTime(),
          );

          sortedAttempts.forEach((item, index) => {
            const totalPoints = parseFloat(item.total_scores);
            const score = parseFloat(item.score);
            const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
            const passed = percentage >= 50;
            const status =
              item.status === "graded"
                ? "completed"
                : item.status === "in-progress"
                  ? "in-progress"
                  : "not-started";

            const categoryName = item.exam?.category_id
              ? categoriesMap[item.exam.category_id] || "unknown"
              : "unknown";

            formatted.push({
              id: `${item.exam_id}-${index + 1}`,
              examAttemptId: item.id,
              rawScore: score,
              examTitle: item.exam?.name || `Exam ${item.exam_id}`,
              category: categoryName,
              attemptNumber: index + 1,
              score,
              totalPoints,
              percentage,
              status,
              timeSpent: `${item.duration_minutes}mn ${item.duration_seconds}s`,
              completedAt: item.date_time_finish,
              passed,
            });
          });
        });

        setExamHistory(formatted);

        const uniqueCategories = Array.from(
          new Set(formatted.map((e) => e.category)),
        );
        setCategories(["all", ...uniqueCategories]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalAttempts: examHistory.length,
    completedExams: examHistory.filter((e) => e.status === "completed").length,
    averageScore:
      examHistory.filter((e) => e.status === "completed").length > 0
        ? Math.round(
            examHistory
              .filter((e) => e.status === "completed")
              .reduce((acc, e) => acc + e.percentage, 0) /
              examHistory.filter((e) => e.status === "completed").length,
          )
        : 0,
    passedExams: examHistory.filter((e) => e.passed).length,
  };

  const filteredHistory = examHistory.filter((exam) => {
    const matchesSearch =
      exam.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || exam.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, passed?: boolean) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant={passed ? "default" : "destructive"}
          className={!passed ? "text-white" : ""}>
            {passed ? "Passed" : "Failed"}
          </Badge>
        );
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading exam history...</p>;
  }

  return (
    <div className="space-y-6 p-2 py-0 sm:p-6 lg:p-4 max-w-8xl mx-auto font-inter">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Exam History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your exam attempts and performance over time.
        </p>
      </div>

      <Card className="shadow-sm rounded-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exams by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px] rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredHistory.map((exam) => (
          <Card key={exam.id} className="shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {exam.examTitle}
                    </h3>
                    {getStatusBadge(exam.status, exam.passed)}
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {exam.category.charAt(0).toUpperCase() + exam.category.slice(1)}
                    </Badge>
                    {exam.attemptNumber && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {exam.attemptNumber === 1
                          ? "Attempt 1"
                          : `Attempt ${exam.attemptNumber}`}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>Score: {exam.score}/{exam.totalPoints}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Duration: {exam.timeSpent}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>
                        Completed: {exam.completedAt ? new Date(exam.completedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0 w-full md:w-auto">
                  {exam.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                    >
                      <Link href={`/dashboard/tests/${exam.examAttemptId}/results?score=${exam.rawScore}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Results
                      </Link>
                    </Button>
                  )}
                  {exam.status === "in-progress" && (
                    <Button
                      size="sm"
                      asChild
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      <Link href={`/student/exams/${exam.id}`}>
                        Continue Exam
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card className="shadow-sm rounded-lg">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
              No exam history found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your filters to see more results."
                : "You haven't taken any exams yet. Start with your first exam!"}
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Link href="/student/exams">Browse Available Exams</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
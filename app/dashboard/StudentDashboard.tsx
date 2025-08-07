// "use client" directive is important for Next.js client-side components
"use client"

// Import necessary React hooks and Next.js Link component
import { useEffect, useState } from "react"
import Link from "next/link"

// Import UI components from shadcn/ui
// Ensure these paths are correct relative to your project structure
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Import Cookies for JWT token management
import Cookies from 'js-cookie'

// Import icons from lucide-react
import {
  Search,
  Calendar,
  Clock,
  Target,
  Eye,
  BarChart3,
} from "lucide-react"

// Import axios for making HTTP requests
import axios from "axios"
import { API_URL } from "@/config"

// Interface for the raw data received from the backend API for exam attempts
// This mirrors the structure of the data returned by your Laravel backend for exam attempts
interface RawExamData {
  id: number // This is the ID of the specific exam attempt record (e.g., 115)
  exam_id: number // This is the ID of the exam template (e.g., 17 for 'Math Exam')
  user_id: number
  date_time_taken: string
  date_time_finish: string
  duration_minutes: number
  duration_seconds: number
  score: string // Backend might send numerical values as strings, so parse them
  total_scores: string // Backend might send numerical values as strings, so parse them
  status: string // e.g., "graded", "in-progress"
  created_at: string
  updated_at: string
  // Nested 'exam' object containing details about the exam template
  exam?: {
    id: number
    name: string // This maps to examTitle (e.g., "Math Exam")
    subject_id: number // This links to the subject name (e.g., ID for "Mathematics")
    description: string | null
    duration: number
    total_questions: number
    is_active: number
    created_at: string
    updated_at: string
  }
}

// Interface for the raw data received from the backend API for subjects
// This mirrors the structure of the data returned by your Laravel backend for subjects
interface RawSubjectData {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

// Interface for the formatted data used in the frontend for displaying exam history
// This is a more user-friendly structure derived from RawExamData
interface ExamAttempt {
  id: string // A unique string ID for display purposes (e.g., "examId-attemptNumber")
  examAttemptId: number; // The actual unique ID of the exam attempt record (item.id from RawExamData)
  rawScore: number; // The raw numerical score of this attempt, passed to results page

  examTitle: string // Display name of the exam
  subject: string // Display name of the subject
  attemptNumber: number // Sequential attempt number for a given exam (1st, 2nd, etc.)
  score: number // Parsed numerical score of this attempt
  totalPoints: number // Parsed numerical total possible points for the exam
  percentage: number // Calculated percentage score
  status: "completed" | "in-progress" | "not-started" // Standardized status for display
  timeSpent: string // Formatted string for duration (e.g., "15m 30s")
  completedAt: string // Formatted date string for when the attempt was finished
  passed: boolean // Boolean indicating if the attempt passed (e.g., >= 70%)
}

// Main functional component for the Student History Page
export default function StudentHistoryPage() {
  // State variables for component functionality
  const [searchTerm, setSearchTerm] = useState("") // Stores text for searching exams
  const [filterSubject, setFilterSubject] = useState("all") // Stores selected subject for filtering
  const [subjects, setSubjects] = useState<string[]>(["all"]) // Stores unique subject names for filter dropdown
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]) // Stores formatted exam history data
  const [loading, setLoading] = useState(true) // Manages loading state for data fetching
  // Stores a map of subject IDs to names for efficient lookup during data processing
  const [allSubjectsMap, setAllSubjectsMap] = useState<Record<number, string>>({});

  // useEffect hook to fetch exam history data and subjects when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true) // Set loading to true at the start of data fetching

        // 1. Fetch subjects first to create a lookup map (ID to Name)
        // This is crucial to convert subject_id from exam data into readable subject names
        const subjectsRes = await axios.get(API_URL+"/api/subjects", {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` }, // Include JWT token for API authentication
        });
        // Assuming your API returns subject data in `response.data.data`
        const subjectsData: RawSubjectData[] = subjectsRes.data.data || [];
        // Create a map: subject.id -> subject.name
        const subjectsMap: Record<number, string> = subjectsData.reduce((acc, subject) => {
          acc[subject.id] = subject.name;
          return acc;
        }, {});
        setAllSubjectsMap(subjectsMap); // Store the generated map in state

        // 2. Then fetch the student's exam history
        const examRes = await axios.get(API_URL+"/api/student/exam-attempts", {
          headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` }, // Include JWT token for API authentication
        })
        const rawData: RawExamData[] = examRes.data // Raw exam attempt data from the API response

        // Group raw data by exam_id to correctly handle multiple attempts for the same exam
        // This allows us to assign sequential attempt numbers (Attempt 1, Attempt 2, etc.)
        const attemptsGrouped = rawData.reduce<Record<number, RawExamData[]>>(
          (acc, curr) => {
            if (!acc[curr.exam_id]) acc[curr.exam_id] = [] // Initialize array for a new exam_id
            acc[curr.exam_id].push(curr) // Add the current attempt to its respective exam group
            return acc
          },
          {} // Start with an empty object for the accumulator
        )

        const formatted: ExamAttempt[] = [] // Array to store the final formatted exam history

        // Process each group of attempts (for each unique exam)
        Object.values(attemptsGrouped).forEach((attempts) => {
          // Sort attempts by their finish date to ensure correct chronological attempt numbering
          const sortedAttempts = attempts.sort(
            (a, b) =>
              new Date(a.date_time_finish).getTime() -
              new Date(b.date_time_finish).getTime()
          )

          // Iterate through the sorted attempts for this exam
          sortedAttempts.forEach((item, index) => {
            // Parse numerical scores from string to float
            const totalPoints = parseFloat(item.total_scores)
            const score = parseFloat(item.score)
            // Calculate percentage, handling division by zero to prevent NaN
            const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
            // Determine if the attempt passed (assuming a 70% passing threshold)
            const passed = percentage >= 50
            // Map backend status strings to a more user-friendly format for the frontend
            const status =
              item.status === "graded"
                ? "completed"
                : item.status === "in-progress"
                ? "in-progress"
                : "not-started"

            // Get the subject name using the pre-built subjects map
            const subjectName = item.exam?.subject_id
              ? subjectsMap[item.exam.subject_id] || "unknown" // Fallback if subject ID not found in map
              : "unknown"; // Fallback if 'exam' object or 'subject_id' is missing

            // Push the fully formatted exam attempt object to the 'formatted' array
            formatted.push({
              id: `${item.exam_id}-${index + 1}`, // Unique display ID (e.g., "17-1", "17-2")
              examAttemptId: item.id, // CRITICAL: The actual unique ID of this attempt record (e.g., 115)
              rawScore: score, // The raw score for this attempt, used for the URL query parameter

              examTitle: item.exam?.name || `Exam ${item.exam_id}`, // Exam name from nested 'exam' object
              subject: subjectName, // Resolved subject name
              attemptNumber: index + 1, // 1-based attempt number
              score, // Parsed score
              totalPoints, // Parsed total points
              percentage, // Calculated percentage
              status, // Formatted status
              timeSpent: `${item.duration_minutes}mn ${item.duration_seconds}s`, // Formatted duration
              completedAt: item.date_time_finish, // Raw finish date for display formatting
              passed, // Pass/fail status
            })
          })
        })

        // Update the component's state with the processed and formatted exam history
        setExamHistory(formatted)

        // Extract unique subject names from the formatted data to populate the subject filter dropdown
        const uniqueSubjects = Array.from(new Set(formatted.map((e) => e.subject)))
        setSubjects(["all", ...uniqueSubjects]) // Add "all" option to the beginning
      } catch (error) {
        // Log any errors that occur during the data fetching process
        console.error("Failed to fetch data", error)
      } finally {
        // Ensure loading state is set to false once data fetching is complete (success or error)
        setLoading(false)
      }
    }

    fetchData() // Call the asynchronous fetchData function when the component mounts
  }, []) // Empty dependency array ensures this effect runs only once after the initial render

  // Calculate overall statistics (currently not used in JSX, but useful for a dashboard summary)
  const stats = {
    totalAttempts: examHistory.length,
    completedExams: examHistory.filter((e) => e.status === "completed").length,
    averageScore:
      examHistory.filter((e) => e.status === "completed").length > 0
        ? Math.round(
            examHistory
              .filter((e) => e.status === "completed")
              .reduce((acc, e) => acc + e.percentage, 0) /
              examHistory.filter((e) => e.status === "completed").length
          )
        : 0,
    passedExams: examHistory.filter((e) => e.passed).length,
  }

  // Filter the exam history based on the current search term and selected subject filter
  const filteredHistory = examHistory.filter((exam) => {
    // Check if exam title or subject includes the search term (case-insensitive)
    const matchesSearch =
      exam.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    // Check if the exam's subject matches the selected filter, or if "all" subjects are selected
    const matchesSubject = filterSubject === "all" || exam.subject === filterSubject
    // Return true only if both search and subject filters match
    return matchesSearch && matchesSubject
  })

  // Helper function to return the appropriate Badge component based on exam status and pass/fail
  const getStatusBadge = (status: string, passed?: boolean) => {
    switch (status) {
      case "completed":
        // If completed, display "Passed" (default variant) or "Failed" (destructive variant)
        return <Badge variant={passed ? "default" : "destructive"}>{passed ? "Passed" : "Failed"}</Badge>
      case "in-progress":
        // If in progress, display "In Progress" (secondary variant)
        return <Badge variant="secondary">In Progress</Badge>
      case "not-started":
        // If not started, display "Not Started" (outline variant)
        return <Badge variant="outline">Not Started</Badge>
      default:
        // Default case for any other unexpected status
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Display a loading message while data is being fetched
  if (loading) {
    return <p className="text-center py-10">Loading exam history...</p>
  }

  // Main component JSX structure for displaying the student's exam history
  return (
    <div className="space-y-6 p-2 py-0 sm:p-6 lg:p-4 max-w-8xl mx-auto font-inter">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Exam History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your exam attempts and performance over time.
        </p>
      </div>

      {/* Filters Section: Contains search input and subject filter dropdown */}
      <Card className="shadow-sm rounded-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input Field */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exams by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Subject Filter Dropdown */}
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-full md:w-[180px] rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                {/* Map through unique subjects to create dropdown items */}
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {/* Display "All Subjects" or capitalize the first letter of the subject name */}
                    {subject === "all" ? "All Subjects" : subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exam List Section: Displays filtered exam attempts */}
      <div className="space-y-4">
        {/* Map through filtered exam history to render each exam attempt card */}
        {filteredHistory.map((exam) => (
          <Card key={exam.id} className="shadow-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center space-x-2 mb-2">
                    {/* Exam Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{exam.examTitle}</h3>
                    {/* Status Badge (e.g., Passed, Failed, In Progress) */}
                    {getStatusBadge(exam.status, exam.passed)}
                    {/* Subject Badge */}
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {/* Capitalize first letter of subject name for display */}
                      {exam.subject.charAt(0).toUpperCase() + exam.subject.slice(1)}
                    </Badge>
                    {/* Attempt Number Badge */}
                    {exam.attemptNumber && (
                      <Badge variant="secondary" className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {exam.attemptNumber === 1 ? "Attempt 1" : `Attempt ${exam.attemptNumber}`}
                      </Badge>
                    )}
                  </div>
                  {/* Exam Details: Score, Duration, Completion Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>
                        Score: {exam.score}/{exam.totalPoints}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Duration: {exam.timeSpent}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>
                        Completed:{" "}
                        {exam.completedAt
                          ? new Date(exam.completedAt).toLocaleDateString() // Format date for user readability
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons: View Results or Continue Exam */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0 w-full md:w-auto">
                  {exam.status === "completed" && (
                    <>
                      <Button variant="outline" size="sm" asChild className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900">
                        {/* Dynamic Link for "View Results": Uses examAttemptId for the path and rawScore as a query parameter */}
                        <Link href={`/dashboard/tests/${exam.examAttemptId}/results?score=${exam.rawScore}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Results
                        </Link>
                      </Button>
                    </>
                  )}
                  {exam.status === "in-progress" && (
                    <Button size="sm" asChild className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white dark:bg-green-700 dark:hover:bg-green-800">
                      {/* Link for "Continue Exam": Uses the display ID (exam_id-attemptNumber) */}
                      <Link href={`/student/exams/${exam.id}`}>Continue Exam</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* "No History Found" State: Displayed if filteredHistory is empty */}
      {filteredHistory.length === 0 && (
        <Card className="shadow-sm rounded-lg">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">No exam history found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {/* Conditional message based on whether filters are applied */}
              {searchTerm || filterSubject !== "all"
                ? "Try adjusting your filters to see more results."
                : "You haven't taken any exams yet. Start with your first exam!"}
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
              <Link href="/student/exams">Browse Available Exams</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
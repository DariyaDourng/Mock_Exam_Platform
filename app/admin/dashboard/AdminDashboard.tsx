"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileText,
  Users,
  BarChart3,
  Clock,
  BookOpen,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronRight,
  Trophy,
} from "lucide-react"

// Import chart components
import { Chart, ChartContainer } from "@/components/ui/chart"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  ArcElement,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend)

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month")

  // Mock data
  const recentCourses = [
    { id: 1, name: "Math Fundamentals", students: 45, avgScore: 78, status: "active" },
    { id: 2, name: "Logic IQ Test", students: 38, avgScore: 82, status: "active" },
    { id: 3, name: "Advanced Mathematics", students: 27, avgScore: 72, status: "draft" },
  ]

  const recentExams = [
    { id: 1, name: "Math Midterm", course: "Math Fundamentals", submissions: 42, avgScore: 76 },
    { id: 2, name: "Logic Assessment", course: "Logic IQ Test", submissions: 35, avgScore: 81 },
  ]

  const topStudents = [
    { id: 1, name: "Alex Johnson", email: "alex.j@example.com", score: 95, courses: 3 },
    { id: 2, name: "Maria Garcia", email: "maria.g@example.com", score: 92, courses: 2 },
    { id: 3, name: "James Wilson", email: "james.w@example.com", score: 90, courses: 3 },
  ]

  const systemAlerts = [
    { id: 1, title: "System Update", message: "Platform will be updated on June 15th at 2:00 AM", type: "info" },
    { id: 2, title: "Storage Warning", message: "Storage usage at 85% of allocated quota", type: "warning" },
  ]

  // Chart data
  const enrollmentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Student Enrollments",
        data: [65, 78, 90, 105, 125, 138],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const courseDistributionData = {
    labels: ["Math", "Logic IQ", "Science", "Language"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
        borderColor: ["rgb(99, 102, 241)", "rgb(14, 165, 233)", "rgb(249, 115, 22)", "rgb(168, 85, 247)"],
        borderWidth: 1,
      },
    ],
  }

  const examScoresData = {
    labels: ["Math Fundamentals", "Logic IQ Test", "Advanced Mathematics", "Critical Thinking", "Algebra Basics"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [78, 82, 72, 80, 81],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/admin/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
        </div>
      </div>
 
      {/* System Alerts */}
      {/* <div className="space-y-2">
        {systemAlerts.map((alert) => (
          <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
            <div className="flex items-start">
              {getAlertIcon(alert.type)}
              <div className="ml-2">
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-600 bg-indigo-50 ">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+2 from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-green-600 bg-green-50 ">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+24 from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-red-600 bg-red-50 ">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+3% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-600 bg-yellow-50 ">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Test Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32m</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              <span>-2m from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
    </div>
  )
}

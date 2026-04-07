'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart3, Clock, BookOpen, TrendingUp, TrendingDown, Users } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/config"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month")
  const [totalCourses, setTotalCourses] = useState(0)
  const [totalExams, setTotalExams] = useState(0) 
  const [totalStudents, setTotalStudents] = useState(0)
  const [avgScore, setAvgScore] = useState(0)
  const [enrollmentData, setEnrollmentData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true)

    try {
      const [coursesRes, examsRes, studentsRes, scoresRes, enrollmentsRes] = await Promise.all([
        axios.get(API_URL+"/api/totalCategories"), // Fixed this route
        axios.get(API_URL+"/api/countExams"), // Fixed this route
        axios.get(API_URL+"/api/students"),
        axios.get(API_URL+"/api/average-scores"),
        axios.get(API_URL+"/api/enrollments")
      ])

      setTotalCourses(coursesRes.data.data)
      setTotalExams(examsRes.data.data) // Assuming the response is like { total_exams: 50 }
      setTotalStudents(studentsRes.data.data)
      setAvgScore(scoresRes.data.data)
      setEnrollmentData(enrollmentsRes.data.data)

    
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Chart data
  // const enrollmentChartData = {
  //   labels: enrollmentData.map((data) => data.month),
  //   datasets: [
  //     {
  //       label: "Student Enrollments",
  //       data: enrollmentData.map((data) => data.count),
  //       borderColor: "rgb(99, 102, 241)",
  //       backgroundColor: "rgba(99, 102, 241, 0.1)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/admin/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Cards for Total Categories, Students, Avg Score, etc. */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-600 bg-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {/* <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+2 from last month</span> */}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-green-600 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {/* <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+24 from last month</span> */}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-red-600 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(avgScore).toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {/* <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+3% from last month</span> */}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-yellow-600 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exam</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {/* <TrendingDown className="mr-1 h-3 w-3 text-red-500" /> */}
              {/* <span>-2m from last month</span> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart for enrollments */}
      <Card>
        {/* <CardHeader> */}
          {/* <CardTitle>Student Enrollments</CardTitle> */}
        {/* </CardHeader> */}
        {/* <CardContent>
          <ChartContainer>
            <Line data={enrollmentChartData} />
          </ChartContainer>
        </CardContent> */}
      </Card>

    </div>
  )
}

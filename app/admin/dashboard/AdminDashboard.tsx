'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Clock, BookOpen, Users } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/config"

export default function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState(0)
  const [totalExams, setTotalExams] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [avgScore, setAvgScore] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [coursesRes, examsRes, studentsRes, scoresRes] = await Promise.all([
        axios.get(API_URL + "/api/totalCategories"),
        axios.get(API_URL + "/api/countExams"),
        axios.get(API_URL + "/api/students"),
        axios.get(API_URL + "/api/average-scores"),
      ])

      setTotalCourses(coursesRes.data.data)
      setTotalExams(examsRes.data.data)
      setTotalStudents(studentsRes.data.data)
      setAvgScore(scoresRes.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-indigo-600 bg-indigo-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>

        <Card className="border border-green-600 bg-green-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="border border-red-600 bg-red-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(avgScore).toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-600 bg-yellow-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exam</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
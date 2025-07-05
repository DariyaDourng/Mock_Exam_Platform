"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Star } from "lucide-react"

interface Test {
  id: number
  name: string
  description: string
  duration: number
  total_questions: number
  difficulty: string
  subject: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get("http://localhost:8000/api/exams") // or /api/tests depending on your backend
      .then((res) => {
        // Adapt if your backend response is nested, e.g. res.data.data
        setTests(res.data.data || res.data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load tests")
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading tests...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!tests.length) return <p>No tests available.</p>

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Available Tests</h1>
            <p className="text-muted-foreground">Choose a test to start practicing</p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </div> */}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{test.name}</CardTitle>
                  {/* <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge> */}
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{test.total_questions} questions</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    {/* <Star className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                    <span>{test.subject}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href={`/dashboard/tests/${test.id}`}>Start Test</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

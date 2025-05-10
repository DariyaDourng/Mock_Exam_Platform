"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Calendar, FileText } from "lucide-react"

export default function StudentScore() {
  const searchParams = useSearchParams()
  const testId = searchParams.get("testId")
  const score = searchParams.get("score")

  const [subjectFilter, setSubjectFilter] = useState("all")

  // Mock data
  const testHistory = [
    {
      id: 1,
      name: "Math Fundamentals",
      score: 85,
      date: "2023-05-01",
      subject: "Math",
      questions: 30,
      correct: 26,
    },
    {
      id: 2,
      name: "Logic IQ Test",
      score: 78,
      date: "2023-04-28",
      subject: "Logic IQ",
      questions: 25,
      correct: 20,
    },
    {
      id: 3,
      name: "Advanced Mathematics",
      score: 72,
      date: "2023-04-15",
      subject: "Math",
      questions: 40,
      correct: 29,
    },
    {
      id: 4,
      name: "Critical Thinking",
      score: 80,
      date: "2023-04-10",
      subject: "Logic IQ",
      questions: 35,
      correct: 28,
    },
  ]

  // If we have a new test result, add it to the top
  const allTests =
    testId && score
      ? [
          {
            id: Number.parseInt(testId),
            name: testId === "1" ? "Math Fundamentals" : "Logic IQ Test",
            score: Number.parseInt(score),
            date: new Date().toISOString().split("T")[0],
            subject: testId === "1" ? "Math" : "Logic IQ",
            questions: testId === "1" ? 30 : 25,
            correct: Math.round((Number.parseInt(score) / 100) * (testId === "1" ? 30 : 25)),
          },
          ...testHistory,
        ]
      : testHistory

  const filteredTests = subjectFilter === "all" ? allTests : allTests.filter((test) => test.subject === subjectFilter)

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (score >= 75) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  // Calculate average scores
  const mathTests = allTests.filter((test) => test.subject === "Math")
  const logicTests = allTests.filter((test) => test.subject === "Logic IQ")

  const mathAvg = mathTests.length ? mathTests.reduce((sum, test) => sum + test.score, 0) / mathTests.length : 0

  const logicAvg = logicTests.length ? logicTests.reduce((sum, test) => sum + test.score, 0) / logicTests.length : 0

  const overallAvg = allTests.length ? allTests.reduce((sum, test) => sum + test.score, 0) / allTests.length : 0

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Scores</h1>
            <p className="text-muted-foreground">Track your test performance over time</p>
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Math">Math</SelectItem>
              <SelectItem value="Logic IQ">Logic IQ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {testId && score && (
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardHeader>
              <CardTitle>Test Completed!</CardTitle>
              <CardDescription>You've completed the test with a score of {score}%.</CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallAvg)}%</div>
              <Progress value={overallAvg} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Math Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(mathAvg)}%</div>
              <Progress value={mathAvg} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Logic IQ Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(logicAvg)}%</div>
              <Progress value={logicAvg} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Test History</CardTitle>
                <CardDescription>Your past test results and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTests.length === 0 ? (
                    <p className="text-center text-muted-foreground">No test results found</p>
                  ) : (
                    filteredTests.map((test) => (
                      <div key={`${test.id}-${test.date}`} className="flex flex-col space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <Badge className={getScoreBadge(test.score)}>{test.score}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(test.date).toLocaleDateString()}</span>
                          </div>
                          <span>
                            {test.correct} / {test.questions} correct
                          </span>
                        </div>
                        <Progress value={test.score} className="h-2" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your test scores over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart className="h-5 w-5" />
                  <span>Performance chart visualization would appear here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

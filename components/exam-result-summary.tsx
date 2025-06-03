"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Trophy } from "lucide-react"

interface ExamResultsSummaryProps {
  score: number
  totalPoints: number
  percentage: number
  timeSpent: string
  status: "passed" | "failed"
  correctAnswers: number
  totalQuestions: number
}

export function ExamResultsSummary({
  score,
  totalPoints,
  percentage,
  timeSpent,
  status,
  correctAnswers,
  totalQuestions,
}: ExamResultsSummaryProps) {
  return (
    <Card className={`border-2 ${status === "passed" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {status === "passed" ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
          <span>Exam {status === "passed" ? "Completed Successfully" : "Not Passed"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {score}/{totalPoints}
            </div>
            <div className="text-sm text-gray-500">Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{percentage}%</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{timeSpent}</div>
            <div className="text-sm text-gray-500">Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Performance</span>
            <span>{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="flex justify-center">
          <Badge variant={status === "passed" ? "default" : "destructive"} className="text-lg px-4 py-2">
            {status === "passed" ? "PASSED" : "FAILED"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

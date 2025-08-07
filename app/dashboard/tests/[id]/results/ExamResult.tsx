"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle, CheckCircle, XCircle, Clock, Calendar, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// ✅ Day.js with timezone
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { API_URL } from "@/config"
dayjs.extend(utc)
dayjs.extend(timezone)

interface ExamResultProps {
  examAttemptId: string
}

interface Answer {
  id: number
  question_id: number
  question_text?: string | null
  question_image?: string | null
  student_answer: string
  correct_answers: string[]
  status: "correct" | "incorrect"
  points?: number | string
  earned_points?: number | string
  created_at: string
}

interface ExamResultData {
  id: number
  exam: {
    id: number
    name: string
    duration: number
  }
  user: {
    id: number
    name: string
    email: string
  }
  date_time_taken?: string | null
  date_time_finish?: string | null
  duration_minutes?: number
  duration_seconds?: number
  score: number | string | null
  status: string
  answers?: Answer[]
  created_at: string
  updated_at: string
}

export default function ExamResult({ examAttemptId }: ExamResultProps) {
  const [result, setResult] = useState<ExamResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchResult() {
      setLoading(true)
      try {
        const token = Cookies.get('jwt_token');
        const res = await axios.get(API_URL+`/api/exam-attempts/${examAttemptId}`, {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        })
        setResult(res.data.data ?? res.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam results",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (examAttemptId) {
      fetchResult()
    }
  }, [examAttemptId])

  // ✅ Handle timestamps from both UTC and local
  const formatDateTime = (dt?: string | null) => {
    if (!dt) return "N/A"
    const isUTC = dt.endsWith("Z")
    const parsed = isUTC ? dayjs.utc(dt).tz("Asia/Phnom_Penh") : dayjs(dt)
    return parsed.format("YYYY-MM-DD HH:mm:ss")
  }

  const formatDuration = (min?: number, sec?: number): string => {
    if ((min ?? 0) === 0 && (sec ?? 0) < 5) return "few seconds"
    return `${min ?? 0}mn ${sec ?? 0}s`
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-72 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-700">Results Not Found</h3>
              <p className="text-gray-500">Unable to load exam results</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const examTitle = result.exam?.name ?? "Exam"
  const earnedPoints = typeof result.score === "string" ? Number.parseFloat(result.score) : (result.score ?? 0)
  const totalPoints = Array.isArray(result.answers)
    ? result.answers.reduce((sum, ans) => sum + Number(ans.points ?? 0), 0)
    : 0

  // Pass if percentage is 50% or more
  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
  const isPass = percentage >= 50

  return (
    <div className="container mx-auto p-2 sm:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1 font-bold text-lg" />
            <span className="text-lg">Back</span>
          </Button>
          
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-gray-50 rounded-lg px-2 py-4 sm:p-6 space-y-6">
        <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Exam Name: {examTitle}</h1>
          </div>
        {/* Score Card */}
        <Card className={`border-2 ${isPass ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              {isPass ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-800">{isPass ? "Congratulations!" : "Keep Trying!"}</h2>
                <p className="text-sm text-gray-600">You {isPass ? "passed" : "did not pass"} the exam</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-800">{earnedPoints.toFixed(2)} points</div>
              <div className="text-xs text-gray-500 mt-1">Points scored</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">
                Total Points: {earnedPoints.toFixed(2)} / {totalPoints.toFixed(2)} ({percentage.toFixed(2)}%)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Timing Information Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Clock className="h-5 w-5" />
              <span>Exam Timeline</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Start Time</p>
                  <p className="text-sm text-gray-600">{formatDateTime(result.date_time_taken)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Calendar className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">End Time</p>
                  <p className="text-sm text-gray-600">{formatDateTime(result.date_time_finish)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <Timer className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-600">
                    {formatDuration(result.duration_minutes, result.duration_seconds)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer List */}
        <div className="space-y-5">
          {Array.isArray(result.answers) && result.answers.length === 0 && (
            <p className="text-gray-600">No questions answered yet.</p>
          )}

          {Array.isArray(result.answers) &&
            result.answers.map((answer, idx) => (
              <Card
                key={answer.id}
                className={`border-l-4 ${answer.status === "correct" ? "border-green-500" : "border-red-500 text-white"}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="text-base font-semibold text-gray-700">Question {idx + 1}</div>
                    <div className="mt-2 text-[12px] text-gray-500">
                      Points: {Number(answer.earned_points ?? 0).toFixed(2)} / {Number(answer.points ?? 0).toFixed(2)}
                    </div>
                  </CardTitle>
                  <div className="mt-2 w-full">
                    <Badge
                      variant={answer.status === "correct" ? "default" : "destructive"}
                      className="w-full text-center"
                    >
                      {answer.status === "correct" ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="text-gray-700">
                  {answer.question_text ? (
                    <p className="mb-4">{answer.question_text}</p>
                  ) : answer.question_image ? (
                    <img
                      src={answer.question_image || "/placeholder.svg"}
                      alt={`Question ${idx + 1}`}
                      className="max-w-full sm:max-w-md rounded-lg border object-contain"
                    />
                  ) : (
                    <p className="mb-4 text-gray-500">No question text or image</p>
                  )}

                  <p className="mb-2 font-medium text-gray-700">
                    Your answer:{" "}
                    <span className="font-normal text-gray-700">
                      {(() => {
                        try {
                          const parsed = JSON.parse(answer.student_answer)
                          return Array.isArray(parsed) ? parsed.join(", ") : parsed
                        } catch {
                          return answer.student_answer
                        }
                      })()}
                    </span>
                  </p>

                  <p className="font-medium text-green-600 max-w-full sm:max-w-xs">
                    Correct answer(s):{" "}
                    <span className="font-normal text-green-600">{answer.correct_answers.join(", ")}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { CheckCircle, Info, ClipboardList, Star, Calendar, MessageCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { API_URL } from "@/config"

interface Choice {
  id: number
  text: string
  isCorrect: boolean
}

interface Question {
  id: number
  category_name?: string
  type?: string
  format: "text" | "image"
  question_text?: string
  question_image?: string | null
  points?: number
  explanation?: string
  choices?: Choice[]
  created_at?: string
}

export default function AdminQuestionPreviewPage() {
  const params = useParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<Question | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    const fetchQuestion = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get<{ data: Question & { choices: any[] } }>(
          API_URL + `/api/questions/${params.id}`,
        )
        const q = response.data.data

        const mappedQuestion: Question = {
          ...q,
          points: Number(q.points),
          choices: q.choices.map((choice) => ({
            id: choice.id,
            text: choice.choice_text,
            isCorrect: Boolean(choice.is_correct),
          })),
        }

        setQuestion(mappedQuestion)
      } catch {
        setError("Failed to load question data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [params.id])

  const handleBack = () => {
    router.push("/admin/question-bank")
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-6 w-6 animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="mt-2 text-sm text-indigo-600">Loading question...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-red-500 text-center">{error}</div>
  }

  if (!question) {
    return <div className="p-8 text-center text-gray-500">No question found.</div>
  }

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Question Preview</h1>
          <p className="text-muted-foreground">Viewing details for Question #{question.id}</p>
        </div>
        {/* Back Button — consistent with other pages */}
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Question Bank
        </Button>
      </div>

      {/* Question Header */}
      <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-indigo-700 border-blue-200 px-3 py-1">
              Question #{question.id}
            </Badge>
            {question.category_name && (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
                {question.category_name}
              </Badge>
            )}
          </div>
          {question.points && (
            <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-sm">{question.points} pts</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
          {question.type && (
            <div className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-1" />
              <span className="capitalize">{question.type.replace("-", " ")}</span>
            </div>
          )}
          {question.created_at && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(question.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-indigo-400 p-3 text-sm text-indigo-700">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>Admin preview only — this page is not shown to students.</span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white shadow-sm border-x border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Question</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {question.format === "text" && (
              <div className="text-sm text-gray-800">{question.question_text}</div>
            )}
            {question.format === "image" && question.question_image && (
              <div className="flex justify-center">
                <img
                  src={question.question_image}
                  alt="Question"
                  className="rounded-lg border border-gray-200 max-w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Answer Choices</h2>
          <div className="space-y-3">
            {question.choices?.map((choice, index) => (
              <div
                key={choice.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  choice.isCorrect ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium flex-shrink-0 ${
                    choice.isCorrect
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1 text-sm text-gray-800">{choice.text}</div>
                {choice.isCorrect && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Correct</span>
                  </div>
                )}
              </div>
            ))}
            {!question.choices?.length && (
              <p className="text-sm text-gray-500 italic">No choices available</p>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            Explanation
          </h2>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-800">{question.explanation}</div>
        </div>
      )}
    </div>
  )
}
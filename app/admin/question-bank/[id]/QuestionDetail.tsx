"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  ChevronLeft,
  CheckCircle,
  Info,
  BookOpen,
  ClipboardList,
  Star,
  Calendar,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Choice {
  id: number
  text: string
  isCorrect: boolean
}

interface Question {
  id: number
  subject_name?: string
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
          `http://localhost:8000/api/questions/${params.id}`
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
            className="mx-auto h-8 w-8 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="mt-2 text-lg font-normal text-primary">Loading question...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center font-medium">{error}</div>
    )
  }

  if (!question) {
    return (
      <div className="p-8 text-center text-muted-foreground">No question found.</div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-6">
      <Button
        variant="ghost"
        className="mb-6 flex items-center space-x-2 group hover:text-primary transition"
        onClick={handleBack}
      >
        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
        <span className="font-normal text-lg">Back to Questions</span>
      </Button>

      <Card className="mx-6">
        <CardHeader>
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Question Number
          </p>
          <CardTitle className="text-3xl font-semibold tracking-tight mb-2">
            #{question.id}
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-6 text-base font-normal">
            Admin preview only — this page is not shown to students.
          </CardDescription>
        </CardHeader>

        {/* Info Panel */}
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 border-b border-gray-300 pb-8">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Subject
              </p>
              <p className="text-lg font-normal">{question.subject_name ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ClipboardList className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Question Type
              </p>
              <p className="capitalize text-lg font-normal">
                {question.type?.replace("-", " ") ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Star className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Points
              </p>
              <p className="text-lg font-normal">{question.points ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Created At
              </p>
              <p className="text-lg font-normal">
                {question.created_at
                  ? new Date(question.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>

        <CardContent className="mt-8 space-y-8">
          <article className="prose max-w-none text-lg font-normal leading-relaxed">
            {question.format === "text" && question.question_text}
            {question.format === "image" && question.question_image && (
              <img
                src={question.question_image}
                alt="Question"
                className="rounded-lg border border-gray-200 max-w-full h-auto"
              />
            )}
          </article>

          <Separator className="border-2 border-gray-300" />

          <section>
            <h2 className="mb-6 text-2xl font-semibold flex items-center gap-3 text-indigo-600">
              <Info className="h-6 w-6" />
              Choices
            </h2>
            <ul className="space-y-4">
              {question.choices?.map((choice) => (
                <li
                  key={choice.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 p-5 shadow-sm cursor-default select-none"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      choice.isCorrect
                        ? "border-indigo-600 bg-green-50 text-indigo-600"
                        : "border-gray-300 text-gray-400"
                    }`}
                    aria-label={choice.isCorrect ? "Correct answer" : undefined}
                  >
                    {choice.isCorrect && <CheckCircle className="h-5 w-5" />}
                  </span>
                  <span className="text-lg font-normal">{choice.text}</span>
                </li>
              ))}
              {!question.choices?.length && (
                <p className="text-gray-500 italic">No choices available</p>
              )}
            </ul>
          </section>

          {question.explanation && (
            <>
              <Separator className="border-2 border-gray-300" />
              <section>
                <h2 className="mb-4 text-2xl font-semibold flex items-center gap-3 text-indigo-600">
                  <MessageCircle className="h-6 w-6" />
                  Explanation
                </h2>
                <p className="prose max-w-none text-lg leading-relaxed font-normal">
                  {question.explanation}
                </p>
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

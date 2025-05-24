"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Option {
  id: string
  text: string
}

interface Question {
  id: number
  question_text: string
  choice_text: Option[]
}

interface TestData {
  id: string
  name: string
  duration: number // minutes
  total_questions: Question[]
}

export default function StudentTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id

  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get<TestData>(`http://localhost:8000/api/exams/${testId}`)
      .then((res) => {
        setTestData(res.data)
        setTimeLeft(res.data.duration * 60)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load test data")
        setLoading(false)
      })
  }, [testId])

  useEffect(() => {
    if (testSubmitted || loading || error || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testSubmitted, timeLeft, loading, error])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    })
  }

  const handleNextQuestion = () => {
    if (testData && currentQuestion < testData.total_questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = async () => {
    if (!testData) return
    setTestSubmitted(true)

    try {
      const payload = {
        answers: testData.total_questions.map((q, idx) => ({
          questionId: q.id,
          answer: answers[idx] || null,
        })),
      }

      const res = await axios.post(`http://localhost:8000/api/exams/${testId}/submit`, payload)
      setScore(res.data.score)

      setTimeout(() => {
        router.push(`/dashboard/scores?testId=${testId}&score=${res.data.score}`)
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit test")
      setTestSubmitted(false)
    }
  }

  if (loading) return <p>Loading test...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!testData) return <p>No test found.</p>

  const question = testData.total_questions[currentQuestion]
  const progress = ((currentQuestion + 1) / testData.total_questions.length) * 100

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{testData.name}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {testData.total_questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={progress} className="h-2 " />

        {testSubmitted ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Submitted</CardTitle>
              <CardDescription>
                Your answers have been recorded. {score !== null ? `Your score: ${score}%` : "Calculating..."}
                Redirecting to results...
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <CardDescription className="text-base font-medium">{question.question_text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {question.choice_text.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted"
                  >
                    <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {!answers[currentQuestion] && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>Please select an answer before proceeding.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <div className="flex gap-2">
                {currentQuestion === testData.total_questions.length - 1 ? (
                  <Button
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={handleSubmitTest}
                    disabled={Object.keys(answers).length < testData.total_questions.length}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion]}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}

        <div className="mt-4 flex flex-wrap gap-2 ">
          {testData.total_questions.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : answers[index] ? "outline" : "ghost"}
              size="sm"
              className={`h-8 w-8 p-0
                ${answers[index] ? "border-indigo-500 text-indigo-600" : ""}
                ${currentQuestion === index ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
              `}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

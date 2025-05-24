"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock question data
const mockQuestion = {
  id: 1,
  question: "What is the capital of France?",
  explanation: "Paris is the capital and most populous city of France.",
  type: "multiple-choice",
  options: [
    { id: 1, text: "London", isCorrect: false },
    { id: 2, text: "Berlin", isCorrect: false },
    { id: 3, text: "Paris", isCorrect: true },
    { id: 4, text: "Madrid", isCorrect: false },
  ],
}

export default function QuestionPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Fetch question data
  useEffect(() => {
    // In a real app, you would fetch from an API
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setQuestion(mockQuestion)
      setIsLoading(false)
    }

    fetchData()
  }, [params.questionId])

  // Handle option selection
  const handleOptionSelect = (id) => {
    if (isAnswered) return
    setSelectedOption(id)
  }

  // Handle submit answer
  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return

    const correctOption = question.options.find((option) => option.isCorrect)
    const isAnswerCorrect = selectedOption === correctOption.id

    setIsCorrect(isAnswerCorrect)
    setIsAnswered(true)
  }

  // Handle reset
  const handleReset = () => {
    setSelectedOption(null)
    setIsAnswered(false)
    setIsCorrect(false)
  }

  // Handle back
  const handleBack = () => {
    router.push(`/admin/tests/${params.id}/questions`)
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading question...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Preview</h1>
          <p className="text-muted-foreground">Preview how this question will appear to students</p>
        </div>
      </div>

      <Card className="mb-6 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Question #{question.id}</CardTitle>
          <CardDescription>This is how the question will appear in the test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{question.question}</div>

          <RadioGroup className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 p-3 rounded-md border ${
                  isAnswered && option.isCorrect
                    ? "border-green-500 bg-green-50"
                    : isAnswered && selectedOption === option.id && !option.isCorrect
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                }`}
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`preview-option-${option.id}`}
                  checked={selectedOption === option.id}
                  onCheckedChange={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                />
                <Label htmlFor={`preview-option-${option.id}`} className="flex-1 text-base cursor-pointer">
                  {option.text}
                </Label>
                {isAnswered && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                {isAnswered && selectedOption === option.id && !option.isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>

          {isAnswered && (
            <Alert className={isCorrect ? "bg-green-50" : "bg-red-50"}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <AlertTitle>{isCorrect ? "Correct!" : "Incorrect!"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {question.explanation ||
                  (isCorrect
                    ? "Great job! You selected the correct answer."
                    : `The correct answer is: ${question.options.find((o) => o.isCorrect).text}`)}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          {isAnswered ? (
            <Button onClick={handleReset}>Try Again</Button>
          ) : (
            <Button onClick={handleSubmitAnswer} disabled={selectedOption === null}>
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Question Information</CardTitle>
          <CardDescription>Additional details about this question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Question Type</h3>
            <p className="text-base">Multiple Choice</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Correct Answer</h3>
            <p className="text-base">{question.options.find((o) => o.isCorrect).text}</p>
          </div>

          {question.explanation && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Explanation</h3>
              <p className="text-base">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StudentTest({ params }: { params: { id: string } }) {
  const router = useRouter()
  const testId = params.id

  // Mock test data
  const testData = {
    id: testId,
    name: testId === "1" ? "Math Fundamentals" : "Logic IQ Test",
    duration: testId === "1" ? 45 : 30,
    questions: [
      {
        id: 1,
        text: "What is the result of 15 × 7?",
        options: [
          { id: "a", text: "95" },
          { id: "b", text: "105" },
          { id: "c", text: "115" },
          { id: "d", text: "125" },
        ],
        correctAnswer: "b",
      },
      {
        id: 2,
        text: "Solve for x: 3x + 7 = 22",
        options: [
          { id: "a", text: "x = 3" },
          { id: "b", text: "x = 5" },
          { id: "c", text: "x = 7" },
          { id: "d", text: "x = 9" },
        ],
        correctAnswer: "b",
      },
      {
        id: 3,
        text: "What is the area of a rectangle with length 12 cm and width 8 cm?",
        options: [
          { id: "a", text: "20 cm²" },
          { id: "b", text: "40 cm²" },
          { id: "c", text: "96 cm²" },
          { id: "d", text: "120 cm²" },
        ],
        correctAnswer: "c",
      },
      {
        id: 4,
        text: "If a = 5 and b = 3, what is the value of a² - b²?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "16" },
          { id: "c", text: "22" },
          { id: "d", text: "25" },
        ],
        correctAnswer: "b",
      },
      {
        id: 5,
        text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        options: [
          { id: "a", text: "24" },
          { id: "b", text: "30" },
          { id: "c", text: "32" },
          { id: "d", text: "36" },
        ],
        correctAnswer: "c",
      },
    ],
  }

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60)
  const [testSubmitted, setTestSubmitted] = useState(false)

  useEffect(() => {
    if (testSubmitted) return

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
  }, [testSubmitted])

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
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    setTestSubmitted(true)

    // Calculate score
    let correctAnswers = 0
    testData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / testData.questions.length) * 100)

    // In a real app, you would send this to the server
    console.log("Test submitted with score:", score)

    // Redirect to results page after a delay
    setTimeout(() => {
      router.push(`/dashboard/scores?testId=${testId}&score=${score}`)
    }, 2000)
  }

  const question = testData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{testData.name}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {testData.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {testSubmitted ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Submitted</CardTitle>
              <CardDescription>Your answers have been recorded. Redirecting to results...</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              <CardDescription className="text-base font-medium">{question.text}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
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
                {currentQuestion === testData.questions.length - 1 ? (
                  <Button onClick={handleSubmitTest} disabled={Object.keys(answers).length < testData.questions.length}>
                    Submit Test
                  </Button>
                ) : (
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleNextQuestion} disabled={!answers[currentQuestion]}>
                    Next
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {testData.questions.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : answers[index] ? "outline" : "ghost"}
              size="sm"
              className={`h-8 w-8 p-0 ${answers[index] ? "border-primary" : ""}`}
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

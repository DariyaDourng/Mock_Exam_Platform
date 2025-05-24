"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Plus, Minus, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

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

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionType, setQuestionType] = useState("multiple-choice")
  const [question, setQuestion] = useState("")
  const [explanation, setExplanation] = useState("")
  const [options, setOptions] = useState([])

  // Fetch question data
  useEffect(() => {
    // In a real app, you would fetch from an API
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setQuestion(mockQuestion.question)
      setExplanation(mockQuestion.explanation || "")
      setQuestionType(mockQuestion.type)
      setOptions(mockQuestion.options)
      setIsLoading(false)
    }

    fetchData()
  }, [params.questionId])

  // Handle option text change
  const handleOptionTextChange = (id, text) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text } : option)))
  }

  // Handle correct option selection
  const handleCorrectOptionChange = (id) => {
    setOptions(options.map((option) => ({ ...option, isCorrect: option.id === id })))
  }

  // Add new option
  const addOption = () => {
    if (options.length >= 8) {
      toast({
        title: "Maximum options reached",
        description: "You can't add more than 8 options.",
        variant: "destructive",
      })
      return
    }

    const newId = Math.max(...options.map((o) => o.id), 0) + 1
    setOptions([...options, { id: newId, text: "", isCorrect: false }])
  }

  // Remove option
  const removeOption = (id) => {
    if (options.length <= 2) {
      toast({
        title: "Minimum options required",
        description: "You need at least 2 options for a question.",
        variant: "destructive",
      })
      return
    }

    // Check if we're removing the correct option
    const isRemovingCorrect = options.find((o) => o.id === id)?.isCorrect

    const filteredOptions = options.filter((option) => option.id !== id)

    // If we removed the correct option, set the first option as correct
    if (isRemovingCorrect && filteredOptions.length > 0) {
      filteredOptions[0].isCorrect = true
    }

    setOptions(filteredOptions)
  }

  // Form validation
  const isFormValid = () => {
    if (!question.trim()) return false
    if (options.some((option) => !option.text.trim())) return false
    if (!options.some((option) => option.isCorrect)) return false
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast({
        title: "Invalid form",
        description: "Please fill in all fields and select a correct answer.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would call an API here
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Question updated",
      description: "The question has been updated successfully.",
    })

    setIsSubmitting(false)
    router.push(`/admin/tests/${params.id}/questions`)
  }

  // Handle cancel
  const handleCancel = () => {
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
        <Button variant="ghost" onClick={handleCancel}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
          <p className="text-muted-foreground">
            Edit question #{params.questionId} for Test #{params.id}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>Edit the question information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger id="question-type">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                placeholder="Enter the question text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
            <CardDescription>Edit answer options and select the correct one</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup className="space-y-4">
              {options.map((option) => (
                <div key={option.id} className="flex items-start space-x-2">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={`option-${option.id}`}
                    checked={option.isCorrect}
                    onCheckedChange={() => handleCorrectOptionChange(option.id)}
                    className="mt-3"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Option {option.id}
                      {option.isCorrect && <span className="ml-2 text-green-500 text-xs">(Correct)</span>}
                    </Label>
                    <div className="flex mt-1">
                      <Input
                        id={`option-text-${option.id}`}
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                        placeholder={`Enter option ${option.id}`}
                        className="flex-1"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="ml-2"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
            <CardDescription>Provide an explanation for the correct answer (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter an explanation for why the correct answer is right"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isFormValid()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

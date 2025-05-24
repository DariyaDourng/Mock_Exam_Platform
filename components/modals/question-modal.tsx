"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"

interface Option {
  id: string
  text: string
}

interface Subject {
  id: number
  name: string
}

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  questionId?: string | number
  subjectName?: string
  mode?: "create" | "edit"
}

export function QuestionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  questionId,
  subjectName,
  mode,
}: QuestionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])

  const [formData, setFormData] = useState({
    id: "",
    text: "",
    subject_id: "",
    options: [] as Option[],
    correctAnswer: "", // important: initially empty so no forced 'a'
    type: "multiple_choice",
  })

  // Load subjects on mount
  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/subjects")
        setSubjects(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch subjects", err)
        toast.error("Failed to load subjects")
      }
    }
    fetchSubjects()
  }, [])

  // Load question and choices when questionId or subjects change
  useEffect(() => {
    if (!questionId) {
      // Reset form for new question
      setFormData({
        id: "",
        text: "",
        subject_id: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: "a", // default selected option
        type: "multiple_choice",
      })
      return
    }

    async function fetchQuestionAndChoices() {
      setIsLoading(true)
      try {
        const questionRes = await axios.get(`http://127.0.0.1:8000/api/questions/${questionId}`)
        const questionData = questionRes.data.data || questionRes.data

        // fetch choices separately, because your backend routes have dedicated endpoint
        const choicesRes = await axios.get(`http://127.0.0.1:8000/api/questions/${questionId}/choices`)
        const choicesData = choicesRes.data.data || choicesRes.data || []

        const options = choicesData.length > 0
          ? choicesData.map((choice: any, idx: number) => ({
              id: String.fromCharCode(97 + idx),
              text: choice.choice_text,
            }))
          : [
              { id: "a", text: "" },
              { id: "b", text: "" },
              { id: "c", text: "" },
              { id: "d", text: "" },
            ]

        // Find correct answer option id (like 'a', 'b', 'c', ...)
        const correctChoiceIndex = choicesData.findIndex((c: any) => c.is_correct)
        const correctAnswer = correctChoiceIndex !== -1
          ? String.fromCharCode(97 + correctChoiceIndex)
          : ""

        setFormData({
          id: questionData.id?.toString() || "",
          text: questionData.question_text || "",
          subject_id: questionData.subject_id?.toString() || "",
          options,
          correctAnswer,
          type: questionData.type || "multiple_choice",
        })
      } catch (error: any) {
        console.error(error)
        toast.error(error.message || "Failed to fetch question")
      } finally {
        setIsLoading(false)
      }
    }

    if (subjects.length > 0) {
      fetchQuestionAndChoices()
    }
  }, [questionId, isOpen, subjects])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index] = { ...updatedOptions[index], text: value }
    setFormData((prev) => ({ ...prev, options: updatedOptions }))
  }

  const addOption = () => {
    if (formData.options.length >= 6) return
    const nextId = String.fromCharCode(97 + formData.options.length)
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: nextId, text: "" }],
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return
    const updatedOptions = formData.options.filter((_, i) => i !== index)
    const newCorrect =
      formData.correctAnswer === formData.options[index].id
        ? updatedOptions[0].id
        : formData.correctAnswer
    setFormData((prev) => ({ ...prev, options: updatedOptions, correctAnswer: newCorrect }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const hasValidOptions = formData.options.every((opt) => opt.text.trim() !== "")
      if (!formData.text.trim() || !formData.type || !hasValidOptions) {
        throw new Error("Please fill all required fields, including at least one valid answer choice.")
      }

      // 1) Update question core data (text, type, subject)
      const questionPayload = {
        question_text: formData.text,
        type: formData.type,
        subject_id: parseInt(formData.subject_id),
      }

      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/questions/${formData.id}`, questionPayload)

        // 2) Update choices separately (your backend has separate route for this)
        const choicesPayload = {
          choices: formData.options.map((opt) => ({
            choice_text: opt.text,
            is_correct: opt.id === formData.correctAnswer,
          })),
        }
        await axios.post(`http://127.0.0.1:8000/api/questions/${formData.id}/choices`, choicesPayload)
      } else {
        // For create: send everything in one call if backend supports it
        const createPayload = {
          ...questionPayload,
          choices: formData.options.map((opt) => ({
            choice_text: opt.text,
            is_correct: opt.id === formData.correctAnswer,
          })),
        }
        await axios.post(`http://127.0.0.1:8000/api/questions`, createPayload)
      }

      toast.success(formData.id ? "Question updated successfully" : "Question added successfully")
      onSubmitSuccess()
      onClose()
    } catch (err: any) {
      console.error("Submit error:", err.message || err)
      toast.error("Submit error: " + (err.message || "Unknown error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto flex justify-center items-center py-20">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>Fetching question data</DialogDescription>
          </DialogHeader>
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Edit Question" : "Add New Question"}</DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update the question details and answer options."
                : `Create a new question${subjectName ? ` for subject: ${subjectName}` : ""}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Course
              </Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) => handleChange("subject_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="text" className="text-right pt-2">
                Question Text
              </Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="col-span-3"
                rows={3}
                required
                placeholder="Enter the question text here..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Question Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Answer Options</Label>
              <div className="col-span-3 space-y-3">
                <Card>
                  <CardContent className="pt-6">
                    <RadioGroup
                      value={formData.correctAnswer}
                      onValueChange={(value) => handleChange("correctAnswer", value)}
                      className="space-y-3"
                    >
                      {formData.options.map((option, index) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                          <div className="flex flex-1 items-center space-x-2">
                            <Label htmlFor={`option-${option.id}`} className="w-6 flex-shrink-0">
                              {option.id.toUpperCase()}.
                            </Label>
                            <Input
                              value={option.text}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${option.id.toUpperCase()}`}
                              className="flex-1"
                              required
                            />
                            {formData.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="h-8 w-8 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove option</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    {formData.options.length < 6 && (
                      <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-3 w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    )}
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  Select the radio button next to the correct answer. You can add up to 6 options.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {formData.id ? "Updating..." : "Creating..."}
                </>
              ) : formData.id ? "Update Question" : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (questionData: any) => void
  examId?: string | number
  examName?: string
  questionData?: {
    id?: string | number
    text: string
    options: Array<{ id: string; text: string }>
    correctAnswer: string
    difficulty?: string
    type?: string
  }
  isEditing?: boolean
}

export function QuestionModal({
  isOpen,
  onClose,
  onSubmit,
  examId,
  examName,
  questionData,
  isEditing = false,
}: QuestionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    text: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ],
    correctAnswer: "a",
    type: "multiple-choice",
  })

  // Update form data when questionData changes (for editing)
  useEffect(() => {
    if (questionData && isEditing) {
      setFormData({
        id: questionData.id?.toString() || "",
        text: questionData.text || "",
        options: questionData.options || [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: questionData.correctAnswer || "a",
        type: questionData.type || "multiple-choice",
      })
    } else {
      // Reset form for new question
      setFormData({
        id: "",
        text: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: "a",
        type: "multiple-choice",
      })
    }
  }, [questionData, isEditing, isOpen])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index] = { ...updatedOptions[index], text: value }
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
    }))
  }

  const addOption = () => {
    if (formData.options.length >= 6) return // Limit to 6 options

    // Generate next option ID (e, f, g, etc.)
    const nextId = String.fromCharCode(97 + formData.options.length) // 97 is ASCII for 'a'

    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: nextId, text: "" }],
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return // Minimum 2 options

    const updatedOptions = formData.options.filter((_, i) => i !== index)

    // If we're removing the correct answer, set the first option as correct
    const newCorrectAnswer =
      formData.correctAnswer === formData.options[index].id ? updatedOptions[0].id : formData.correctAnswer

    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctAnswer: newCorrectAnswer,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onSubmit({
        ...formData,
        examId,
      })
      onClose()
    } catch (error) {
      console.error("Error submitting question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Question" : "Add New Question"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the question details and answer options."
                : `Create a new question for the exam${examName ? `: ${examName}` : ""}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Question"
              ) : (
                "Add Question"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

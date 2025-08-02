"use client"

import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
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
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface ExamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (examData: any) => Promise<void>
  examData?: {
    id?: string | number
    name: string
    course?: string | number | { id?: string | number }
    description?: string
    duration?: string | number
    questions?: string | number
    passingScore?: string | number
    status?: string
    isActive?: boolean
  }
  courses: { id: string | number; name: string }[]
}

export function ExamModal({ isOpen, onClose, onSubmit, examData, courses }: ExamModalProps) {
  const isEdit = !!examData?.id
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    course: "",
    description: "",
    duration: "45",
    questions: "30",
    passingScore: "70",
    isActive: true,
  })

  useEffect(() => {
    // Determine courseId string safely, handling both object or primitive
    let courseId = ""
    if (examData) {
      if (typeof examData.course === "object" && examData.course !== null) {
        courseId = examData.course.id?.toString() || ""
      } else {
        courseId = examData.course?.toString() || ""
      }

      setFormData({
        id: examData.id?.toString() || "",
        name: examData.name || "",
        course: courseId,
        description: examData.description || "",
        duration: examData.duration?.toString() || "45",
        questions: examData.questions?.toString() || "30",
        passingScore: examData.passingScore?.toString() || "70",
        isActive:
          typeof examData.isActive === "boolean"
            ? examData.isActive
            : examData.status === "active",
      })
    } else {
      setFormData({
        id: "",
        name: "",
        course: "",
        description: "",
        duration: "45",
        questions: "30",
        passingScore: "70",
        isActive: true,
      })
    }
  }, [examData, courses])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!formData.course) {
        toast.error("Please select a course.")
        setIsSubmitting(false)
        return
      }
      await onSubmit(formData)
      // toast.success(isEdit ? "Exam updated successfully!" : "Exam created successfully!")
      onClose()
    } catch (error) {
      toast.error("Failed to submit exam. Please try again.")
      console.error("Error submitting exam:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Exam" : "Add New Exam"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the exam information." : "Create a new exam for your students."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleChange("course", value)}
              >
                <SelectTrigger id="course" className="col-span-3">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questions" className="text-right">
                Questions
              </Label>
              <Input
                id="questions"
                type="number"
                min={1}
                value={formData.questions}
                onChange={(e) => handleChange("questions", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
{/* 
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                id="passingScore"
                type="number"
                min={1}
                max={100}
                value={formData.passingScore}
                onChange={(e) => handleChange("passingScore", e.target.value)}
                className="col-span-3"
                required
              />
            </div> */}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  {formData.isActive ? "Active (visible to students)" : "Draft (hidden from students)"}
                </Label>
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
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Exam"
              ) : (
                "Create Exam"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
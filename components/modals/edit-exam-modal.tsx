"use client"

import React, { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import axios from "axios"

interface AddExamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (examData: any) => void
}

export function AddExamModal({ isOpen, onClose, onSubmit }: AddExamModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
  const [examData, setExamData] = useState({
    name: "",
    course: "",
    description: "",
    duration: "45",
    questions: "30",
    passingScore: "70",
    isActive: true,
  })

  const [courses, setCourses] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/courses")
        setCourses(response.data) // Make sure your backend returns array of { id, name }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  const handleChange = (field: string, value: any) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      onSubmit({ ...examData, dueDate: date })
      onClose()
    } catch (error) {
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
            <DialogTitle>Add New Exam</DialogTitle>
            <DialogDescription>Create a new exam for your students.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={examData.name}
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
                value={examData.course}
                onValueChange={(value) => handleChange("course", value)}
              >
                <SelectTrigger id="course" className="col-span-3">
                  <SelectValue
                    placeholder={isLoadingCourses ? "Loading..." : "Select course"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
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
                value={examData.description}
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
                value={examData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="col-span-3"
                min="1"
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
                value={examData.questions}
                onChange={(e) => handleChange("questions", e.target.value)}
                className="col-span-3"
                min="1"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="passingScore" className="text-right">
                Passing Score (%)
              </Label>
              <Input
                id="passingScore"
                type="number"
                value={examData.passingScore}
                onChange={(e) => handleChange("passingScore", e.target.value)}
                className="col-span-3"
                min="1"
                max="100"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={examData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  {examData.isActive
                    ? "Active (visible to students)"
                    : "Draft (hidden from students)"}
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
                  Creating...
                </>
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

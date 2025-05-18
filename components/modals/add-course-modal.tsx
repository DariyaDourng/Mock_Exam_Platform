'use client'

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Upload, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (courseData: {
    name: string
    description: string
    isActive: boolean
    image: File | null
  }) => Promise<void>
}

export function AddCourseModal({ isOpen, onClose, onSubmit }: AddCourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    isActive: true,
    image: null as File | null,
  })
  const [imageError, setImageError] = useState<string | null>(null)

  const handleChange = (field: string, value: any) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file.")
      handleChange("image", null)
    } else if (file.size > 2 * 1024 * 1024) {
      setImageError("The image size should be less than 2MB.")
      handleChange("image", null)
    } else {
      setImageError(null)
      handleChange("image", file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(courseData)
      toast.success("Course created successfully")
      setCourseData({
        name: "",
        description: "",
        isActive: true,
        image: null,
      })
      onClose()
    } catch (error) {
      console.error("Error submitting course:", error)
      toast.error("Failed to create course")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Create a new course for your students.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={courseData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">Course Image</Label>
              <div className="col-span-3">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center gap-2 p-[8px] border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm text-black">Upload image</span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                {courseData.image && (
                  <img
                    src={URL.createObjectURL(courseData.image)}
                    alt="Preview"
                    className="mt-2 max-h-32 rounded border"
                  />
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended size: 1280x720px. Max size: 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">Active Status</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={courseData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  {courseData.isActive ? "Active (visible to students)" : "Draft (hidden from students)"}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !!imageError}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

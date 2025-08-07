'use client'

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/config"

interface DeleteQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  questionId: string | null
  onDeleted: () => void
}

export function DeleteQuestionModal({ isOpen, onClose, questionId, onDeleted }: DeleteQuestionModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    if (!questionId) return
    setIsDeleting(true)

    try {
      const response = await fetch(API_URL+`/api/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          // If auth required: "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const message = errorData?.message || "Failed to delete question"
        throw new Error(message)
      }

      onDeleted()  // Notify parent component to refresh data
      onClose()    // Close the modal
    } catch (error: any) {
      console.error("Delete failed:", error)
      alert(error.message || "Failed to delete the question. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this question? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            className="text-white"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

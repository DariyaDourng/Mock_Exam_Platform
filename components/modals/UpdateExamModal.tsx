import axios from "axios"
import toast from "react-hot-toast"
import React, { useState, useEffect } from "react"
import { ExamModal } from "./exam-modal"
import { API_URL } from "@/config"

export function UpdateExamModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  examId,
  courses,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  examId: string | number
  courses: { id: string | number; name: string }[]
}) {
  const [examData, setExamData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !examId) {
      setExamData(null)
      return
    }

    async function fetchExam() {
      setLoading(true)
      try {
        const res = await axios.get(API_URL+`api/exams/${examId}`)
        const data = res.data.data

        // Map backend response to the shape expected by ExamModal
        const mappedExam = {
          id: data.id,
          name: data.name || "",
          course: data.subject_id?.toString() || "", // backend uses subject_id
          description: data.description || "",
          duration: data.duration?.toString() || "45",
          questions: data.total_questions?.toString() || "30",
          isActive: data.is_active === 1,
        }

        setExamData(mappedExam)
      } catch (error) {
        console.error("Failed to fetch exam:", error)
        toast.error("Failed to load exam data.")
        setExamData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchExam()
  }, [isOpen, examId])

  // Show loading text while fetching exam data
  if (loading && isOpen) {
    return <div className="p-4 text-sm text-gray-500">Loading exam data...</div>
  }

  // Submit handler expects a clean payload with correct types
const handleSubmit = async (updatedExam: any) => {
  const payload = {
    name: updatedExam.name,
    subject_id: Number(updatedExam.course),
    description: updatedExam.description,
    duration: Number(updatedExam.duration),
    total_questions: Number(updatedExam.questions),
    is_active: updatedExam.isActive ? 1 : 0,
  };

  console.log("Submitting payload:", payload);

  try {
    const res = await axios.put(API_URL+`api/exams/${examId}`, payload);
    console.log("Response from update:", res);

    toast.success("Exam updated successfully!");
    onSubmitSuccess();
    onClose();
  } catch (error: any) {
    console.error("Update failed:", error.response || error.message || error);
    toast.error("Failed to update exam.");
  }
};

  return (
    <ExamModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      examData={examData || undefined}
      courses={courses}
    />
  )
}

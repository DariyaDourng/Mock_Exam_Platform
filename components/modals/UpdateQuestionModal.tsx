"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { QuestionModal } from "./question-modal"

interface UpdateQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess: () => void
  questionId: string | number
}

export function UpdateQuestionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  questionId,
}: UpdateQuestionModalProps) {
  const [questionData, setQuestionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setQuestionData(null)
      return
    }

    if (!questionId || questionId === "") {
      setQuestionData(null)
      return
    }

    async function fetchQuestion() {
      setLoading(true)
      try {
        console.log("Fetching question ID:", questionId)
        const res = await axios.get(`http://localhost:8000/api/questions/${questionId}`)
        console.log("Question data from API:", res.data.data)
        const data = res.data.data

        const options = (data.choices || []).map((choice: any, idx: number) => ({
          id: idx + 1,
          text: choice.choice_text,
          isCorrect: choice.is_correct,
        }))

        setQuestionData({
          id: data.id,
          subjectId: data.subject?.id ?? null,
          type: data.type,
          format: data.format,
          question: data.question_text || "",
          questionImage: data.question_image
            ? typeof data.question_image === "string"
              ? { url: data.question_image, file: null, name: "" }
              : { url: data.question_image.url, file: null, name: data.question_image.name || "" }
            : null,
          points: parseFloat(data.points) || 1,  // <-- Fix here: convert points string to number
          explanation: data.explanation || "",
          options,
        })
      } catch (error) {
        console.error("Failed to fetch question", error)
        toast.error("Failed to load question data.")
        setQuestionData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [questionId, isOpen])

  // Optional: you can enable this loading UI if you want
  // if (loading) {
  //   return <div className="p-6 text-center">Loading question data...</div>
  // }

  // if (!questionData && isOpen) {
  //   return <div className="p-6 text-center text-red-500">No data found for this question.</div>
  // }

  return (
    <QuestionModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSubmitSuccess}
      question={questionData}
      mode="edit"
    />
  )
}

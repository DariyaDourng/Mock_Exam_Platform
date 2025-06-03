'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddQuestionsToExamProps {
  examId: number;
}

export default function AddQuestionsToExam({ examId }: AddQuestionsToExamProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // Fetch all questions or only those related to the examId if your API supports that
        const res = await axios.get('http://localhost:8000/api/questions');
        const allQuestions = Array.isArray(res.data) ? res.data : res.data.data || [];

        // Filter questions by examId association
        // Assuming your question objects have a field like `exam_ids` (array) or `exam_id`
        const filteredQuestions = allQuestions.filter((q: any) => {
          if (Array.isArray(q.exam_ids)) {
            return q.exam_ids.includes(examId);
          }
          // or if there's a single exam_id field:
          if (typeof q.exam_id === 'number') {
            return q.exam_id === examId;
          }
          return false;
        });

        setQuestions(filteredQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setQuestions([]);
      }
    }

    fetchQuestions();
  }, [examId]);

  const toggleSelectQuestion = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedQuestionIds.length === 0) {
      alert('Please select at least one question.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/exams/${examId}/questions`, {
        question_ids: selectedQuestionIds,
      });
      alert('Questions added to exam!');
      setSelectedQuestionIds([]);
    } catch (error) {
      console.error('Failed to add questions:', error);
      alert('Failed to add questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Questions to Exam #{examId}</h1>

      {questions.length === 0 ? (
        <p>No questions found for this exam.</p>
      ) : (
        <ul className="space-y-3 mb-4">
          {questions.map((q) => (
            <li key={q.id} className="flex items-center space-x-2">
              <input
                id={`question-${q.id}`}
                type="checkbox"
                checked={selectedQuestionIds.includes(q.id)}
                onChange={() => toggleSelectQuestion(q.id)}
                className="cursor-pointer"
              />
              <label htmlFor={`question-${q.id}`} className="cursor-pointer select-none">
                {q.question_text || 'Image Question'}
              </label>
            </li>
          ))}
        </ul>
      )}

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Selected Questions'}
      </button>
    </div>
  );
}

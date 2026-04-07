'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Toaster } from 'sonner';
import AddQuestionsToExam from '@/components/AddQuestionsToExam';

export default function ExamPage() {
  const params = useParams();
  const examId = params.examId;
  const examIdNumber = examId ? Number(examId) : undefined;

  if (!examIdNumber) {
    return <div>Please provide a valid exam ID.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto p-6 **:relative">
        <Toaster />
        <AddQuestionsToExam examId={examIdNumber} />
      </main>
    </div>
  );
}
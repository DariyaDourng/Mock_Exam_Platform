'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header/Header';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';
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
      {/* Fixed Header */}
      <Header />

      {/* Content area below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebarPage />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-100 relative">
          <Toaster />
          <AddQuestionsToExam examId={examIdNumber} />
        </main>
      </div>
    </div>
  );
}

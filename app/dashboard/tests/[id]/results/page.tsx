'use client';

import * as React from 'react'
import Header from '@/components/header/Header';
import AdminSidebarPage from '@/components/sidebar/student-sidebar';
import ExamResult from './ExamResult';

export default function aStudentScorePage({ params }: { params: { id: string } }) {
  // const { id } =  params;
  const resolveParams = React.use(params);
  return (
    <div className="flex flex-col h-screen">
      <Header onToggleSidebar={() => {}} />
      <div className="flex h-screen">
        <AdminSidebarPage />
        <main className="flex-1 overflow-y-auto p-2 py-16 bg-gray-100">
          <ExamResult examAttemptId={resolveParams.id} />
        </main>
      </div>
    </div>
  );
}

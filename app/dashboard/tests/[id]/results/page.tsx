'use client';
import * as React from 'react';
import { useState } from 'react';
import ExamResult from './ExamResult';

export default function aStudentScorePage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resolveParams = React.use(params);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-screen">
        <main className="flex-1 overflow-y-auto ">
          <ExamResult examAttemptId={resolveParams.id} />
        </main>
      </div>
    </div>
  );
}
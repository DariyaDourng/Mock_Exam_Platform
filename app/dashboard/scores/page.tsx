'use client';

import { useState } from 'react';
import StudentScore from './StudentScore';
import StudentSidebarPage from '@/components/sidebar/student-sidebar';

function StudentScorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-screen">
        <StudentSidebarPage
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-50">
          <StudentScore />
        </main>
      </div>
    </div>
  );
}

export default StudentScorePage;
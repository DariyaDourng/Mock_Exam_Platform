
import React from 'react'
import StudentScore from './StudentScore';
import StudentDashboard from '../StudentDashboard';

function StudentScorePage() {
  return (
  <div className="flex flex-col h-screen">
        <div className="flex h-screen">
          <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-50"><StudentScore/></main>
          <StudentDashboard />
        </div>
      </div>
  )
}

export default StudentScorePage;

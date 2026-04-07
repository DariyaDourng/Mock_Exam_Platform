
import React from 'react'
import StudentDashboard from './StudentDashboard';

function StudentLeaderboardPage() {
  
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <StudentDashboard/>
      </main>
    </div>
  )
}

export default StudentLeaderboardPage;

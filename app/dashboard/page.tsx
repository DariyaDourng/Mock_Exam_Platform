
import React from 'react'

import StudentSidebar from '@/components/sidebar/student-sidebar';
import Header from '@/components/header/Header';
import StudentDashboard from './StudentDashboard';

function StudentLeaderboardPage() {
  
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <StudentSidebar />         {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6 py-20 bg-gray-50"><StudentDashboard/></main>
        </div>
      </div>
  )
}

export default StudentLeaderboardPage;

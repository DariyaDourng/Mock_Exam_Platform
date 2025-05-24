
import React from 'react'
import StudentSidebar from '@/components/sidebar/student-sidebar';
import Header from '@/components/header/Header';
import StudentTest from './StudentTest';







function StudentScorePage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
              {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-100"><StudentTest params={{ id: `question` }} /></main>
        </div>
      </div>
  )
}

export default StudentScorePage;

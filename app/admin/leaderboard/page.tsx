
import React from 'react'
import AdminPerformances from './AdminPerformances';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';
import Header from '@/components/header/Header';
import StudentLeaderboard from '@/app/dashboard/leaderboard/StudentLeaderboard';






function AdminQuestionPage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <AdminSidebarPage />         {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100 py-28"><StudentLeaderboard/></main>
        </div>
      </div>
  )
}

export default AdminQuestionPage;

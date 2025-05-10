

import React from 'react'
import AdminStudent from './AdminStudent';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';
import Header from '@/components/header/Header';





function AdminStudentPage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <AdminSidebarPage />         {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 py-28"><AdminStudent/></main>
        </div>
      </div>
  )
}

export default AdminStudentPage;

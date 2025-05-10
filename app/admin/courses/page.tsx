
import React from 'react'
import AdminCourse from './AdminCourse';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';
import Header from '@/components/header/Header';


function AdminCoursePage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <AdminSidebarPage />         {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-50"><AdminCourse/></main>
        </div>
      </div>
  )
}

export default AdminCoursePage;
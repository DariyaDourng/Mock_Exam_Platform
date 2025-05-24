
import React from 'react'
import AdminQuestion from './AdminQuestion'
import AdminSidebarPage from '@/components/sidebar/admin-sidebar'
import Header from '@/components/header/Header';
import { Toaster } from '@/components/ui/toaster';





function AdminQuestionPage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <AdminSidebarPage />         {/* stays at top */}
          <Toaster/>
          <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-100"><AdminQuestion/></main>
        </div>
      </div>
  )
}

export default AdminQuestionPage;

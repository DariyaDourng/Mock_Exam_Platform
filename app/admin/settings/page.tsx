import Header from '@/components/header/Header'
import React from 'react'
import AdminSetting from './AdminSetting';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';




function AdminSettingPage() {
  return (
  <div className="flex flex-col h-screen">
        <Header />  {/* takes full height */}
        <div className="flex h-screen">
          <AdminSidebarPage />         {/* stays at top */}
          <main className="flex-1 overflow-y-auto p-6"><AdminSetting/></main>
        </div>
      </div>
  )
}

export default AdminSettingPage;

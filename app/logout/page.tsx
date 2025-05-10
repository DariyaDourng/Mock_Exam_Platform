import React from 'react'
import Header from '@/components/header/Header';
import AdminSidebarPage from '@/components/sidebar/admin-sidebar';


function LogoutPage() {
  return (
   <div className="flex flex-col h-screen">
       <Header />  {/* takes full height */}
       <div className="flex h-screen">
         <AdminSidebarPage />         {/* stays at top */}
         <main className="flex-1 overflow-y-auto p-6">Your content here</main>
       </div>
     </div>
  )
}

export default LogoutPage;

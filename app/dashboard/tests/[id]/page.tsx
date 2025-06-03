'use client';

import React from 'react';
import Header from '@/components/header/Header';
import StudentTest from './StudentTest';
import AdminSidebarPage from '@/components/sidebar/student-sidebar';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentScorePage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const handleToggleSidebar = () => {
    console.log('Sidebar toggled');
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="flex h-screen">
        <AdminSidebarPage />
        <main className="flex-1 overflow-y-auto p-2 py-12 bg-gray-100">
          <StudentTest params={{ id }} />
        </main>
      </div>
    </div>
  );
}

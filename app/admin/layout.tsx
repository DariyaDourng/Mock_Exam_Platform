'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/sidebar/admin-sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition"
            aria-label="Open sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <span className="text-white font-semibold text-sm">Mock-Exam Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
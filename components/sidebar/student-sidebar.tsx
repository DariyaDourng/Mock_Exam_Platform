'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AdminSidebarPage() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Available Exam', icon: ClipboardDocumentCheckIcon, path: '/dashboard/tests' },
    { name: 'Your Result', icon: ClipboardDocumentCheckIcon, path: '/dashboard/scores' },
    { name: 'Leaderboard', icon: ChartBarIcon, path: '/dashboard/leaderboard' },
  ];

  return (
    <>
      {/* Mobile Open Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 focus:outline-none top-0"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
          
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Image
                src="/images/Applogo.png"
                alt="Online Exam Platform Logo"
                width={40}
                height={40}
                priority
              />
              <h1 className="text-xl text-indigo-600 font-semibold">Mock-Exam</h1>
            </div>

            {/* Close Sidebar Button (only mobile) */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 focus:outline-none"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive =
                item.path === '/dashboard'
                  ? pathname === item.path
                  : pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                      ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-100'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Optional: Dark overlay when sidebar is open (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

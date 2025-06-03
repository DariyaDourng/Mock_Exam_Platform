'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get('http://localhost:8000/api/profile', {
          withCredentials: true,
        });
        const name = res.data.data?.name || res.data.name || "User";
        setUserName(name);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        setUserName("User");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleViewProfile = () => {
    router.push('/admin/profile');
  };

  const handleLogout = () => {
    // Clear cookies or call logout API if needed here
    router.push('/login');
  };

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white z-50">
      {/* Sidebar toggle button visible on all screen sizes */}
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center h-10 w-10 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User info and dropdown */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">{loading ? 'Loading...' : userName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 outline-none"
              aria-label="User menu"
            >
              {loading ? "..." : getInitials(userName)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bars3Icon } from '@heroicons/react/24/outline';

import axios from 'axios';
import Cookies from 'js-cookie';
import Modal from '../ui/modal';
import AdminProfile from '@/app/admin/profile/page';
import { API_URL } from '@/config';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = Cookies.get('jwt_token');
        const res = await axios.get(API_URL+'/api/profile', {
           headers: {
          Authorization: `Bearer ${token}`,
  },
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

  const getInitials = (name: string | null) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0].substring(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // NEW logout handler
  const handleLogout = async () => {
    try {

      const token = Cookies.get('jwt_token');
      await axios.post(API_URL+'/api/logout', {}, {
          headers: {
          Authorization: `Bearer ${token}`,
  },
       
      });
      
      // Optionally clear any local storage tokens if you use
      Cookies.remove('jwt_token');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed, please try again.');
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 text-white">
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <span className="text-sm md:text-base">{loading ? 'Loading...' : userName}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700">
                {loading ? "..." : getInitials(userName)}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Replace this with new logout handler */}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <AdminProfile onClose={() => setShowProfileModal(false)} />
      </Modal>
    </>
  );
};

export default Header;

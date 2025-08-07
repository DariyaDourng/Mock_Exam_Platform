'use client';

import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '@/config';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(API_URL+'/api/logout', {}, {
        // withCredentials: true, // important to send cookies
      });

      // Clear any localStorage tokens if stored
      Cookies.remove('token');

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed, please try again.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-800 font-semibold"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

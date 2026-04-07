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
      const token = Cookies.get('jwt_token'); //match the key used at login

      await axios.post(
        API_URL + '/api/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      //Always clear the correct cookie key and redirect
      Cookies.remove('jwt_token'); // was wrongly 'token' before
      router.push('/login');
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
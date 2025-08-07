'use client';

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { API_URL } from '@/config';

interface AdminProfileProps {
  onClose: () => void;
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.length === 1
    ? parts[0].substring(0, 2).toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AdminProfile({ onClose }: AdminProfileProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    school: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
           const token = Cookies.get('jwt_token');
        const res = await axios.get(API_URL+'/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
         
          // withCredentials: true,
        });

        const data = res.data.data;
        let schoolName = '';

        // Fetch school name using school_id
        if (data.school_id) {
          try {
            const token = Cookies.get('jwt_token');
            const schoolRes = await axios.get(API_URL+`/api/schools/${data.school_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              // withCredentials: true,
            });
            schoolName = schoolRes.data?.data?.name || '';
          } catch {
            console.warn('Failed to fetch school name.');
          }
        }

        setForm({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar_url || '',
          school: schoolName,
        });
      } catch {
        alert('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Your Profile</h1>

      <div className="flex justify-center mb-4">
        <div className="relative">
          {form.avatar ? (
            <Image
              src={form.avatar}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
              {getInitials(form.name)}
            </div>
          )}
        </div>
      </div>

      <form className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          placeholder="Email"
        />
        <input
          type="text"
          name="school"
          value={form.school}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          placeholder="School Name"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

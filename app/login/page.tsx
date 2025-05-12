'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, rememberMe: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: form.email,
        password: form.password,
      });

      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting to your dashboard...',
      });

      // Optionally store token or user info here
      // localStorage.setItem('token', response.data.token);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Server Error',
          description: 'Something went wrong during login.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center flex-1 px-8 sm:px-20">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">Welcome back!</h2>
          <h3 className="text-xl font-bold text-center mb-8">Login to your account here</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address <span className='text-red-500'>*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className='text-red-500'>*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#4A3AFF] text-white font-medium rounded-md hover:bg-indigo-700 transition"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-[#4A3AFF] text-white p-10">
        <Image src="/images/Applogo.png" alt="Exam Illustration" width={300} height={300} />
        <h2 className="mt-6 text-2xl font-bold">Mock Exam Platform</h2>
      </div>
    </div>
  );
};

export default Login;

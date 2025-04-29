'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', form);
    // You can add API login request here
    alert('Logged in!');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center flex-1 px-8 sm:px-20">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">Welcome back!</h2>
          <h3 className="text-xl font-bold text-center mb-8">Login to your account here</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
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
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Image + title */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-[#4A3AFF] text-white p-10">
        <Image src="/images/Applogo.png" alt="Exam Illustration" width={300} height={300} />
        <h2 className="mt-6 text-2xl font-bold">Mock Exam Platform</h2>
      </div>
    </div>
  );
};

export default Login;

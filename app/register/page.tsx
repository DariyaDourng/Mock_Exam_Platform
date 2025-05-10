'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', form);
    // You can add API registration request here
    alert('Registered successfully!');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center flex-1 px-8 sm:px-20">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Email Address Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="rounded-md w-full py-2 px-4 bg-[#4A3AFF] text-white font-medium hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Image + Title */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-[#4A3AFF] text-white p-10">
        <Image src="/images/Applogo.png" alt="Mock Exam Platform" width={300} height={300} />
        <h2 className="mt-6 text-2xl font-bold">Mock Exam Platform</h2>
      </div>
    </div>
  );
};

export default RegisterPage;

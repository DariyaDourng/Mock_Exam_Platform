'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    school: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    email: '',
  });

  // Debounced email check
  const checkEmailExists = debounce(async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: '' }));
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/check-email', { email });
      setErrors((prev) => ({
        ...prev,
        email: res.data.exists ? 'This email already exists!' : '',
      }));
    } catch (err) {
      console.error('Email check error:', err);
    }
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'email') checkEmailExists(value);

    if (name === 'password') {
      const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      setErrors((prev) => ({
        ...prev,
        password: strong.test(value)
          ? ''
          : 'Password must be at least 8 characters, include uppercase, lowercase, number, and symbol.',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        gender: form.gender,
        school_name: form.school,
      });

      toast.success(res.data.message || 'Registered successfully. Please verify your email.');
    } catch (err: any) {
      const messages = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join('\n')
        : 'Registration failed.';
      toast.error(messages);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center flex-1 px-8 sm:px-20">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Name" name="name" value={form.name} onChange={handleChange} required />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              error={errors.email}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.gender}
                onValueChange={(value) => setForm({ ...form, gender: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputField label="School Name" name="school" value={form.school} onChange={handleChange} required />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              error={errors.password}
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="rounded-md w-full py-2 px-4 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-indigo-600
       text-white p-10">
        <Image src="/images/Applogo.png" alt="Mock Exam Platform" width={300} height={300} />
        <h2 className="mt-6 text-2xl font-bold">Mock Exam Platform</h2>
      </div>
    </div>
  );
};

// Helper component
const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  error = '',
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default RegisterPage;

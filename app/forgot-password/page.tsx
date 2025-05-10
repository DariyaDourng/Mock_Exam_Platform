'use client'
import React, { useState } from 'react';
import { NextPage } from 'next';


const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Add API request for password reset here (example):
    try {
      const res = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('Check your email for the password reset link.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Forgot your password?</h2>
        <div className="text-center text-sm text-gray-600 mb-6">
          No problem. Just let us know your email address and we will email you a password reset link.
        </div>

        {message && <p className="text-center text-sm mb-4 text-gray-700">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Email Password Reset Link'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

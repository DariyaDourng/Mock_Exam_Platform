import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Mobile menu button placeholder */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {/* Add mobile menu icon if needed */}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                logo
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md ">
                  Home
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                  About
                </Link>
                <Link href="/resources" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                  Resources
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md" >
                  Contact
                </Link>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link href="/get-started" className="bg-[#4A3AFF] text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

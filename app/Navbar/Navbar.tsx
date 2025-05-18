'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = ['home', 'about', 'resources', 'contact'];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Online Exam
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex gap-6 items-center">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-gray-500 px-3 py-2 border-b-2 transition-all ${
                  activeSection === section
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:border-indigo-400'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
            {/* Login Button */}
            <Link
              href="/login"
              className="text-indigo-600 px-4 py-2 border border-indigo-600 rounded-md"
            >
              Login
            </Link>
            {/* Get Started Button */}
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

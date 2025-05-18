import React from 'react';
import Image from 'next/image';

function HeroSection() {
  return (
    <div className="bg-gray-100 py-12 " id="home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left side - Text */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl font-semibold text-gray-900">
              Take Online
              <div>Exam.</div>
            </h1>
            <div className="flex flex-col">
              <p className="mt-4 text-lg text-gray-600">
                Number of active users right now
              </p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">200+</p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="md:w-1/2 flex justify-center py-4">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/images/Bitmap.png"  // Corrected image path
                alt="Online Exam Illustration"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;

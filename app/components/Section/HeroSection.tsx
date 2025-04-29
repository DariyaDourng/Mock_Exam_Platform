import React from 'react'
import Image from 'next/image';
import examImage from '../../../public/images/Bitmap.png'
function HeroSection() {
  return (
    <div className='flex justify-between items-center py-16 px-6 bg-gray-100'>
   
      <div className="w-full md:w-1/2">
        <h1 className="text-4xl font-extrabold text-gray-900">Take Online
          <div>Exam.</div>
        </h1>
     
        <p className="mt-4 text-lg ">NUMBER OF ACTIVE USERS RIGHT NOW</p>
        <p className="mt-2 text-3xl font-bold text-[#4A3AFF]">200+</p>
      </div>

      {/* Right side image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Image
            src={examImage}
            alt="Online Exam Illustration"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection

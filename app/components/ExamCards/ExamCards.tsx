// components/ExamTypesSection.tsx

import Image from 'next/image';
import primaryExamImage from '../public/images/Bitmap.png'; // Replace with your PNG image path
import bankExamImage from '../public/images/Bitmap(2).png'; 
import nsiExamImage from '../public/images/Bitmap(3).png';

function ExamCards() {
  return (
    <div>
       <section className="py-16 px-6 bg-indigo-600">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center text-white font-extrabold">Choose Your Exam</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Primary Exam */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={primaryExamImage}
                alt="Primary Exam"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-800">Primary Exam</h3>
            </div>
          </div>

          {/* Bank Exam */}
          <div className="bg-green-500 rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={bankExamImage}
                alt="Bank Exam"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-white">Bank Exam</h3>
            </div>
          </div>

          {/* NSI Exam */}
          <div className="bg-yellow-200 rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={nsiExamImage}
                alt="NSI Exam"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-800">NSI Exam</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default ExamCards


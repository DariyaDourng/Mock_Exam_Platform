'use client';
import Image from 'next/image';
import Link from 'next/link';

function ExamCards() {
  const exams = [
    {
      title: 'Logic Exam',
      image: 'images/Bitmap.png',  // Correct path
      href: '/exam/logic',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Math Exam',
      image: 'images/Bitmap(2).png',  // Correct path
      href: '/exam/math',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <section className="bg-[#4F46E5] py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-white mb-16">
          Choose Your Exam
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {exams.map((exam, index) => (
            <Link
              href={exam.href}
              key={index}
              className={`group ${exam.bgColor} rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300`}
            >
              <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-inner mb-6 group-hover:scale-105 transition-transform">
                <Image
                  src={`/${exam.image}`}  // Correct path, relative to the public directory
                  alt={exam.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600">
                {exam.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExamCards;

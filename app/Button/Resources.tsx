'use client';

export default function Resources() {
  return (
    <main className="pt-24 px-6 max-w-4xl mx-auto py-12" id="resources">
      <h1 className="text-4xl font-bold mb-8 text-center">Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-md shadow-md">
          <h2 className="text-2xl font-medium mb-4">Logic Exam Guide</h2>
          <p>Tips and sample questions to master logic exams.</p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Math Practice Kit</h2>
          <p>Practice problems and strategies for math exams.</p>
        </div>
      </div>
    </main>
  );
}

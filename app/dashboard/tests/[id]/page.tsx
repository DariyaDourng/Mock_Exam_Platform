'use client';

import React from 'react';
import StudentTest from './StudentTest';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentScorePage({ params }: PageProps) {
  const { id } = React.use(params);

  return (
    <main className="flex-1 overflow-y-auto">
      <StudentTest params={{ id }} />
    </main>
  );
}
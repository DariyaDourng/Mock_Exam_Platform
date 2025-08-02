'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // to get the dynamic id param
import axios from 'axios';

interface Student {
  id: number;
  name: string;
  email: string;
  gender?: string;
  is_active: boolean | 0 | 1;
  school?: {
    id: number;
    name: string;
  };
}

export default function StudentProfilePage() {
  const { id } = useParams(); // get student id from URL
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchStudent() {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/students/${id}`);
        if (res.data.status === 'success') {
          setStudent(res.data.data);
        } else {
          setError('Failed to load student data');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching student');
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  if (loading) return <div>Loading student profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!student) return <div>No student found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{student.name}'s Profile</h1>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Gender:</strong> {student.gender ?? '-'}</p>
      <p><strong>School:</strong> {student.school?.name ?? 'N/A'}</p>
      <p><strong>Status:</strong> {student.is_active ? 'Active' : 'Inactive'}</p>
      {/* Add more details or UI as needed */}
    </div>
  );
}

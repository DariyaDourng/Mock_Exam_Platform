import AdminCourse from './AdminCategory';
import { Toaster } from 'react-hot-toast';

export default function AdminCoursePage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      <Toaster />
      <AdminCourse />
    </main>
  );
}
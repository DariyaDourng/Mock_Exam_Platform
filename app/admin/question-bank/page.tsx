import AdminQuestion from './AdminQuestion';
import { Toaster } from '@/components/ui/toaster';

export default function AdminQuestionPage() {
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
      <Toaster />
      <AdminQuestion />
    </main>
  );
}
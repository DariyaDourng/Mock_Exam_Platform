import AdminExamsPage from "./AdminExam";
import { Toaster } from "sonner";

export default function AdminExamsPage_() {
  return (
    <main className="flex-1 overflow-y-auto">
      <Toaster />
      <AdminExamsPage />
    </main>
  );
}
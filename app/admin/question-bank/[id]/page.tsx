
import AdminSidebarPage from "@/components/sidebar/admin-sidebar";
import { Toaster } from "sonner";
import QuestionDetail from "./QuestionDetail";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebarPage />
      <Toaster/>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <QuestionDetail />
      </main>
    </div>
  );
}

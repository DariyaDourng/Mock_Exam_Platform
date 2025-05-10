
import Header from "@/components/header/Header";
import AdminSidebarPage from "@/components/sidebar/admin-sidebar";
import AdminDashboard from "./AdminDashboard";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Content area below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (full height below header) */}
        <AdminSidebarPage />

        {/* Main content scrolls inside here */}
        <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-50">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

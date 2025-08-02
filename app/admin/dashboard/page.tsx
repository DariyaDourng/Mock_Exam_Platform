'use client'
import Header from "@/components/header/Header";
import AdminSidebarPage from "@/components/sidebar/admin-sidebar";
import AdminDashboard from "./AdminDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


interface DecodedToken {
  role_id: number;
  exp: number;
  // any other fields from your token
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('jwt_token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Decoded token:', decoded);

      if (decoded.role_id !== 1) {
        // Not admin
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Token decoding failed:', err);
      router.push('/login');
    }
  }, [router]);
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <Header />

      {/* Content area below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (full height below header) */}
        <AdminSidebarPage />

        {/* Main content scrolls inside here */}
        <main className="flex-1 overflow-y-auto p-6 py-28 bg-gray-100">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

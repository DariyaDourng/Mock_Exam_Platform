'use client'
import AdminDashboard from "./AdminDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role_id: number;
  exp: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('jwt_token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.role_id !== 1) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Token decoding failed:', err);
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="flex-1 overflow-y-auto">
      <AdminDashboard />
    </main>
  );
}
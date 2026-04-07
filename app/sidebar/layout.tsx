// app/admin/layout.tsx
"use client"

import dynamic from "next/dynamic"
import type React from "react"

const AdminDashboardLayout = dynamic(
  () => import("../../components/admin-dashboard-layout"),
  { ssr: false, loading: () => <div>Loading...</div> }
) as React.ComponentType<{ children: React.ReactNode }>

export default function AdminDashboardLayoutPage({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
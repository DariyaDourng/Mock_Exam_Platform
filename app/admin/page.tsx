// app/admin/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to /admin/dashboard when accessing /admin/
    router.push('/admin/dashboard')
  }, [router])

  return null  // This component doesn't render anything
}

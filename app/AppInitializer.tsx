'use client';

import { useEffect } from 'react';
import { setupAxiosInterceptors } from '@/utils/axiosConfig';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Setup axios interceptors when app initializes
    setupAxiosInterceptors();
  }, []);

  return <>{children}</>;
}

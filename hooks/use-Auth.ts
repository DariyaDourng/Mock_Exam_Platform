// hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check auth from localStorage or backend
    setLoading(false);
  }, []);

  return { user, loading, setUser };
}

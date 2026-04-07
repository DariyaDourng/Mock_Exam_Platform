// hooks/useAuth.ts
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Only runs on the client — safe to access cookies/localStorage here
    const token = Cookies.get("jwt_token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Optionally fetch user info from backend using the token
    setLoading(false);
  }, []);

  return { user, loading, setUser };
}
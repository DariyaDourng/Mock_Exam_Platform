import Cookies from 'js-cookie';

export async function login(email: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    // ✅ Save token to a cookie instead of localStorage
    Cookies.set('jwt_token', data.token, { expires: 1 }); // 1 day expiry

    return { success: true, user: data.user };
  } else {
    return { success: false, message: data.message || 'Login failed' };
  }
}

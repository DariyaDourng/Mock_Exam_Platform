import Cookies from 'js-cookie';
import { API_URL } from '@/config';

export async function login(email: string, password: string, rememberMe = false) {
  const response = await fetch(API_URL + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    //Respect rememberMe: 7 days vs session cookie
    Cookies.set('jwt_token', data.token, {
      expires: rememberMe ? 7 : undefined,
    });
    return { success: true, user: data.user };
  } else {
    return { success: false, message: data.message || 'Login failed' };
  }
}
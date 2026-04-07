import axios from 'axios';
import Cookies from 'js-cookie';

export function setupAxiosInterceptors() {
  // Response interceptor for handling 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired - clear token and redirect to login
        Cookies.remove('jwt_token');
        
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        // Don't throw the error - silently handle it
        return Promise.reject(new Error('Session expired. Redirecting to login...'));
      }
      
      // For other errors, pass them through
      return Promise.reject(error);
    }
  );
}

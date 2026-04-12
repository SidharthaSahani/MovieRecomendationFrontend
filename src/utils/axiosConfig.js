import axios from 'axios';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    // Determine which token to use based on current path
    const isAdminPath = window.location.pathname.startsWith('/admin');
    
    let token;
    if (isAdminPath) {
      token = localStorage.getItem('adminToken');
    } else {
      token = localStorage.getItem('userToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/admin/login') ||
                          error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      
      if (isAdminPath) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('userToken');
        // Only redirect if we're not already on a login/register page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

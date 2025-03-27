import axios from 'axios';

const COMPANY_ID = "d2f4906d-8e71-4623-afc1-c3af5654ae2a";

const axiosInstance = axios.create({
  baseURL: 'https://nilgirisecom.anthillnetworks.com/api/ecom/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include company_id
axiosInstance.interceptors.request.use(
  (config) => {
    // For GET requests, add company_id to params
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        company_id: COMPANY_ID
      };
    } else {
      // For non-GET requests, add company_id to body
      if (!config.data) {
        config.data = {};
      }
      config.data = {
        ...config.data,
        company_id: COMPANY_ID
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any existing auth state if you're using local/session storage
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
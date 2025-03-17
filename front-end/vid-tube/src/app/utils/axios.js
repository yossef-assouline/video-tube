import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Response interceptor with more detailed error logging
api.interceptors.response.use(
  (response) => {
   
    return response;
  },
  (error) => {
    // Detailed error logging
    
    // Network error
    if (error.message === 'Network Error') {
      
      return Promise.reject({
        message: 'Unable to reach the server. Please check your internet connection.'
      });
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      
      return Promise.reject({
        message: 'Request timed out. Please try again.'
      });
    }

    // Server error
    if (error.response) {
     
      return Promise.reject(error.response.data);
    }

    // Unknown error
    
    return Promise.reject({
      message: 'An unexpected error occurred'
    });
  }
);

export default api; 
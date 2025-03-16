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
    console.log('Making request to:', config.url, {
      method: config.method,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', {
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor with more detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('Successful response from:', response.config.url, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Detailed error logging
    console.error('API Error:', {
      url: error.config?.url || 'URL not available',
      method: error.config?.method || 'Method not available',
      status: error.response?.status || 'Status not available',
      statusText: error.response?.statusText || 'Status text not available',
      data: error.response?.data || 'No response data',
      message: error.message || 'No error message',
      stack: error.stack || 'No stack trace'
    });

    // Network error
    if (error.message === 'Network Error') {
      console.error('Network Error - API is unreachable');
      return Promise.reject({
        message: 'Unable to reach the server. Please check your internet connection.'
      });
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({
        message: 'Request timed out. Please try again.'
      });
    }

    // Server error
    if (error.response) {
      console.error('Server responded with error:', {
        status: error.response.status,
        data: error.response.data
      });
      return Promise.reject(error.response.data);
    }

    // Unknown error
    console.error('Unhandled error:', error);
    return Promise.reject({
      message: 'An unexpected error occurred'
    });
  }
);

export default api; 
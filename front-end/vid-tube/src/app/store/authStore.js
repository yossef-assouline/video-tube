import { create } from "zustand";
import api from '../utils/axios';
import Cookies from 'js-cookie'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

const API_URL = `${BASE_URL}/api/v1/users`;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  loginError: null,
  error: null,
  loggedInUser: null,
  registerError: null,
  signup: async (formData) => {
    set({ isLoading: true, registerError: null });
    try {
      const response = await api.post('/api/v1/users/register', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      set({ isLoading: false  });
      return response;
    } catch (error) {
      set({ registerError: error.response.data.message, isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/v1/users/login', credentials);
      
      // Store token in localStorage
      if (response.data.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
      }

      set({ 
        user: response.data.user, 
        isAuthenticated: true,
        error: null 
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isAuthenticated: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/v1/users/check-auth');
      set({ 
        user: response.data.user, 
        isAuthenticated: true,
        error: null 
      });
    } catch (error) {
      // Clear token if auth check fails
      localStorage.removeItem('accessToken');
      set({ 
        user: null, 
        isAuthenticated: false,
        error: error.response?.data?.message || 'Authentication failed' 
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/v1/users/logout');
      // Clear stored token
      localStorage.removeItem('accessToken');
      set({ 
        user: null, 
        isAuthenticated: false,
        error: null 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  changePassword: async (newPassword, oldPassword) => {
    try {
      await api.put('/api/v1/users/change-password', 
        { newPassword, oldPassword }, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error changing password:", error);
    }
  },

  updateProfile: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put('/api/v1/users/update-account', 
        formData, 
        { withCredentials: true }
      );
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  updateAvatar: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch('/api/v1/users/update-avatar', 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  },

  updateCoverImage: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch('/api/v1/users/update-cover-image', 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  }
}));

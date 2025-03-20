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

  login: async (email, password) => {
    set({ isLoading: true, loginError: null });
    try {
      const response = await api.post('/api/v1/users/login', { email, password });
      
      // Store token in localStorage
      if(response.data.statusCode === 200){
        console.log("ok")
        localStorage.setItem('accessToken', response.data.data.accessToken);
        Cookies.set('logged_in', 'true', { path: '/' });
      }

      set({ 
        user: response.data.data.user, 
        isAuthenticated: true,
        loginError: null,
        isLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error.response?.data?.message || "Error logging in", 
        isLoading: false, 
        loginError: error.response?.data?.message || "Error logging in" 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/v1/users/current-user');
      if (response.data.data) {
        set({ 
          loggedInUser: response.data.data, 
          user: response.data.data,
          isAuthenticated: true, 
          isCheckingAuth: false,
          error: null 
        });
      // Set authentication cookie on successful auth check
      } else {
        set({ 
          loggedInUser: null, 
          user: null,
          isAuthenticated: false, 
          isCheckingAuth: false,
          error: null 
        });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      
      set({ 
        loggedInUser: null,
        isAuthenticated: false, 
        isCheckingAuth: false,
        error: error.response?.data?.message || "Error checking authentication" 
      });
      // Remove authentication cookie on failed auth check
      Cookies.remove('logged_in', { path: '/' });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/v1/users/logout');
      Cookies.remove('logged_in', { path: '/' });
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

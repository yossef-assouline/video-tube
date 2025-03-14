import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:7000/api/v1/users";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  loginError: null,

  signup: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
    }
  },
  login: async (email , password) => {
    set({ isLoading: true, error: null });
    try {
       
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
 
      set({ user: response.data.data, isAuthenticated: true, isLoading: false , loginError: null });
    } catch (error) {

      set({ error: error.response?.data?.message || "Error logging in", isLoading: false , loginError: error.response?.data?.message || "Error logging in" });
    }
  },
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/current-user`);
      set({ user: response.data.data, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false, error: error.response?.data?.message || "Error checking authentication" });
    }
  },
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
  changePassword: async (newPassword, oldPassword) => {
    try {
      await axios.put(`${API_URL}/change-password`, { newPassword, oldPassword });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  },
  updateProfile: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/update-account`, formData);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
  ,
  updateAvatar: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.patch(`${API_URL}/update-avatar`, formData , {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  } , 
  updateCoverImage: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.patch(`${API_URL}/update-cover-image`, formData , {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  }
}));

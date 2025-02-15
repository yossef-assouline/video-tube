import { create } from "zustand";
import axios from "axios";
const API_URL = "http://localhost:7000/api/v1/users";
axios.defaults.withCredentials = true;
export const useActionStore = create((set) => ({
  channelData: null,
  isLoading: false,
  error: null,
  findChannel: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/c/${username}`);
      set({ 
        channelData: response.data.data, 
        isLoading: false, 
        error: null 
      });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error finding channel", 
        isLoading: false 
      });
      return null;
    }
  }
}));


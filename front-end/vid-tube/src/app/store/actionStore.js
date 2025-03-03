import { create } from "zustand";
import axios from "axios";
const USER_API_URL = "http://localhost:7000/api/v1/users";
const VIDEO_API_URL = "http://localhost:7000/api/v1/videos";
const SUBSCRIPTION_API_URL = "http://localhost:7000/api/v1/subscriptions";
axios.defaults.withCredentials = true;
export const useActionStore = create((set) => ({
  channelData: null,
  isLoading: false,
  videos: [],
  error: null,
  video: null,
  toggleSubscribeLoading : false,

  findChannel: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${USER_API_URL}/c/${username}`);
      const channelData = response.data.data;

      // Fetch videos immediately after getting channel data
      const videosResponse = await axios.get(
        `${VIDEO_API_URL}/u/${channelData._id}/published`
      );
      set({
        channelData: channelData,
        videos: videosResponse.data.data,
      });
      // Return both channel and videos data
      return {
        channel: channelData,
        videos: videosResponse.data.data,
      };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error finding channel",
        isLoading: false,
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  publishVideo: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${VIDEO_API_URL}/publish`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false, error: null });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error publishing video",
        isLoading: false,
      });
      return null;
    }
  },
  toggleSubscribe: async (channelId) => {
    set({ toggleSubscribeLoading: true, error: null });
    try {
      const response = await axios.post(
        `${SUBSCRIPTION_API_URL}/c/${channelId}`
      );
      set({ isLoading: false, error: null });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error toggling subscribe",
        isLoading: false,
      });
      return null;
    }
  },
  getVideoById: async (videoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${VIDEO_API_URL}/${videoId}`);
      set({ isLoading: false, error: null, video: response.data.data });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching video",
        isLoading: false,
      });
      return null;
    }
  },
}));

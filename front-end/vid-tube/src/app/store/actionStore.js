import { create } from "zustand";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

const USER_API_URL = `${BASE_URL}/api/v1/users`;
const VIDEO_API_URL = `${BASE_URL}/api/v1/videos`;
const SUBSCRIPTION_API_URL = `${BASE_URL}/api/v1/subscriptions`;
const LIKE_API_URL = `${BASE_URL}/api/v1/likes`;
const COMMENT_API_URL = `${BASE_URL}/api/v1/comments`;

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useActionStore = create((set) => ({
  channelData: null,
  isLoading: false,
  isFetchingVideos: false,
  videos: [],
  AllVideos: [],
  error: null,
  video: null,
  toggleSubscribeLoading : false,
  toggleLikeLoading : false,
  comments: [],
  commentLoading: false,
  subscribedChannels: [],
  watchHistory: [],
  likedVideos: [],
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
  deleteVideo: async (videoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${VIDEO_API_URL}/${videoId}`);
      set({ isLoading: false, error: null });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting video",
        isLoading: false,
      });
    }
  },
  updateVideo: async (videoId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${VIDEO_API_URL}/${videoId}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ isLoading: false, error: null });
      return response.data.data;  
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating video",
        isLoading: false,
      });
    }
  },
  fetchAllVideos: async () => {
    set({ isFetchingVideos: true, error: null });
    try {
      const response = await axios.get(VIDEO_API_URL);
      set({ isFetchingVideos: false, error: null, AllVideos: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching videos",
        isFetchingVideos: false,
      });
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
  toggleLike: async (videoId) => {
    
    set({ toggleLikeLoading: true, error: null });
    try {
      const response = await axios.post(`${LIKE_API_URL}/toggle/v/${videoId}`);
      set({ isLoading: false, error: null });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error toggling like",
        isLoading: false,
      });
      return null;
    }
  },
  getVideoComments: async (videoId) => {
    set({ commentLoading: true, error: null });
    try {
      const response = await axios.get(`${COMMENT_API_URL}/${videoId}`);
      set({ commentLoading: false, error: null, comments: response.data.data });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching comments",
        commentLoading: false,
      });
      return null;
    }
  },
  postComment: async (videoId, comment) => {
    set({ commentLoading: true, error: null });
    try {
      const response = await axios.post(`${COMMENT_API_URL}/${videoId}`, { comment });
      set({ commentLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error posting comment",
        commentLoading: false,
      });
      return null;
    }
  },
  deleteComment: async (commentId) => {
    set({ commentLoading: true, error: null });
    try {
      const response = await axios.delete(`${COMMENT_API_URL}/c/${commentId}`);
      set({ commentLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting comment",
        commentLoading: false,
      });
      return null;
    }
  },
  updateComment: async (commentId, editedContent) => {
    set({ commentLoading: true, error: null });
    try {
      const response = await axios.patch(`${COMMENT_API_URL}/c/${commentId}`, { updatedComment: editedContent });
      set({ commentLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating comment",
        commentLoading: false,
      });
      return null;
    }
  },
  getSubscribedChannels: async (userId) => {
    try {
      const response = await axios.get(`${SUBSCRIPTION_API_URL}/s/${userId}`);
      set({ subscribedChannels: response.data.data.subscribedChannels  });

    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching subscribed channels",
      });
      return null;
    }
  },
  getWatchHistory: async () => {
    try {
      const response = await axios.get(`${USER_API_URL}/history`);
      set({ watchHistory: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching watch history",
      });
      return null;
    }
  },
  toggleCommentLike: async (commentId) => {
    try {
      
      const response = await axios.post(`${LIKE_API_URL}/toggle/c/${commentId}`);
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Error liking comment",
      });
      throw error;
    }
  },
  getLikedVideos: async () => {
    try {
      const response = await axios.get(`${LIKE_API_URL}/videos`);
      set({ likedVideos: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching liked videos",
      });
      return null;
    }
  }
}));

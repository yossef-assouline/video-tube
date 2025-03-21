import { create } from "zustand";
import axios from "axios";
import api from "../utils/axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";
const USER_API_URL = `${BASE_URL}/api/v1/users`;
const VIDEO_API_URL = `${BASE_URL}/api/v1/videos`;
const SUBSCRIPTION_API_URL = `${BASE_URL}/api/v1/subscriptions`;
const LIKE_API_URL = `${BASE_URL}/api/v1/likes`;
const COMMENT_API_URL = `${BASE_URL}/api/v1/comments`;

// First, create an axios instance with default config


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
  isUploading: false,
  uploadedVideo: null,
  findChannel: async (username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/users/c/${username}`, { withCredentials: true });
      const channelData = response.data.data;

      // Fetch videos immediately after getting channel data
      const videosResponse = await api.get(
        `/api/v1/videos/u/${channelData._id}/published`,
        { withCredentials: true }
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
    set({ isUploading: true, error: null, uploadedVideo: null });
    try {
      const response = await api.post(`/api/v1/videos/publish`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      set({ isUploading: false, error: null, uploadedVideo: response.data });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error publishing video",
        isUploading: false,
      });
      return null;
    }
  },
  getVideoById: async (videoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/videos/${videoId}`);

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
  deleteVideo: async (videoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/api/v1/videos/${videoId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Delete video error:', error);
      set({
        error: error.response?.data?.message || 'Error deleting video',
        isLoading: false
      });
      return null;
    }
  },
  updateVideo: async (videoId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/api/v1/videos/${videoId}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
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
      const response = await api.get('/api/v1/videos', { withCredentials: true });
      set({ isFetchingVideos: false, error: null, AllVideos: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching videos",
        isFetchingVideos: false,
      });
    }
  },  
  getVideoById: async (videoId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/videos/${videoId}` ,{ withCredentials: true });
      set({ isLoading: false, error: null, video: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching video",
        isLoading: false,
      });
      return null;
    }
  },
  toggleSubscribe: async (channelId) => {
    set({ toggleSubscribeLoading: true, error: null });
    try {
      const response = await api.post(
        `/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
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
  toggleLike: async (videoId) => {
    
    set({ toggleLikeLoading: true, error: null });
    try {
      const response = await api.post(
        `/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
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
      const response = await api.get(`/api/v1/comments/${videoId}`, { withCredentials: true });
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
      const response = await api.post(
        `/api/v1/comments/${videoId}`,
        { comment },
        { withCredentials: true }
      );
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
      const response = await api.delete(`/api/v1/comments/c/${commentId}`, { withCredentials: true });
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
      const response = await api.patch(
        `/api/v1/comments/c/${commentId}`,
        { updatedComment: editedContent },
        { withCredentials: true }
      );
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
      const response = await api.get(`/api/v1/subscriptions/s/${userId}`, { withCredentials: true });
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
      const response = await api.get(`/api/v1/users/history`, { withCredentials: true });
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
      
      const response = await api.post(
        `/api/v1/likes/toggle/c/${commentId}`,
        {},
        { withCredentials: true }
      );
      
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
      const response = await api.get(`/api/v1/likes/videos`, { withCredentials: true });
      set({ likedVideos: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching liked videos",
      });
      return null;
    }
  }
}));

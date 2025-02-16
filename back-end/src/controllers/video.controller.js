import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import  getVideoMetadata  from "video-metadata-thumbnails";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  console.log("Files received:", req.files); // Debug log to see what's being received
  
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "No files were uploaded");
  }

  const { title, description } = req.body;
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!title || !description || !videoFileLocalPath || !thumbnailLocalPath){
    throw new ApiError(400, "All fields are required");
  }
  

  
  
  try {
    const uploadVideoResponse = await uploadOnCloudinary(videoFileLocalPath);
    const uploadThumbnailResponse = await uploadOnCloudinary(thumbnailLocalPath);
    const metadata = await getVideoMetadata(videoFile.path);
    const duration = metadata.duration; 
    // TODO: get video, upload to cloudinary, create video
    const video = await Video.create({
      owner: req.user._id,
      videoFile: uploadVideoResponse.url,
      thumbnail: uploadThumbnailResponse.url,
      title,
      description,
      duration,
      views: 0,
      isPublished: true,
    });
    return res.status(200).json(new ApiResponse(200, video));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to publish video");
  }

});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

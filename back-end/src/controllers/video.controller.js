import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 100,
    sortBy = "createdAt",
    sortType = -1,
  } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pipeline = [
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },

    {
      $sort: {
        [sortBy]: parseInt(sortType),
      },
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ].filter(Boolean);

  const videos = await Video.aggregate(pipeline);

  const totalVideos = await Video.countDocuments({ isPublished: true });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalVideos / parseInt(limit)),
        totalVideos,
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res, next) => {
  const { title, description, visibility } = req.body;

  if (!title) {
    return next(new ApiError(400, "title cannot be empty"));
  }

  if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
    return next(
      new ApiError(400, "Please select a video and a thumbnail image to upload")
    );
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  const video = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  const isPublished = visibility === "public" ? true : false;
  // TODO: get video, upload to cloudinary, create video
  const videoDoc = await Video.create({
    owner: req.user._id,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: video.duration,
    views: 0,
    isPublished,
  });
  if (!videoDoc) {
    return next(new ApiError(500, "Failed to publish video"));
  }
  res
    .status(201)
    .json(new ApiResponse(200, videoDoc, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) {
    return next(new ApiError(400, "Video id is required"));
  }
  if (!isValidObjectId(videoId)) {
    return next(new ApiError(400, "Invalid video id"));
  }

  // Add check for video existence
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    return next(new ApiError(404, "Video not found"));
  }
  
  let video = await Video.updateOne(
    { _id: new mongoose.Types.ObjectId(videoId) },
    { $inc: { views: 1 } },
  );


  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner._id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likes",
        },
        subscribers: {
          $size: "$subscribers",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [req.user._id, "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ];
  video = await Video.aggregate(pipeline);
  
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video[0],
        `video with id ${videoId} fetched successfully`
      )
    );
});

const updateVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) {
    return next(new ApiError(400, "video id is missing."));
  }

  if (!isValidObjectId(videoId)) {
    return next(new ApiError(400, "invalid video id"));
  }

  const { title, description, visibility } = req.body;

  let playlistIds = [];
  playlistIds = JSON.parse(req.body.playlistIds || "[]");

  // get local path of thumbnail, get old thumbnail public id for deletion
  let thumbnailLocalPath, newThumbnail, oldThumbnail;

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $project: {
        _id: 0,
        thumbnail: 1,
      },
    },
  ];

  oldThumbnail = await Video.aggregate(pipeline);

  if (req.file) {
    thumbnailLocalPath = req.file?.path;
    console.log("222 ", thumbnailLocalPath);
    newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!newThumbnail) {
      return next(
        new ApiError(500, "something went wrong while uploading thumbnail")
      );
    }

    // delete old thumbnail from cloudinary
    console.log("529", oldThumbnail[0].thumbnail);
    await deleteFromCloudinary(
      oldThumbnail[0].thumbnail.split("/").pop().split(".")[0]
    );
  }

  const isPublished = visibility === "public" ? true : false;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: newThumbnail?.url,
        isPublished,
      },
    },
    { new: true }
  );

  if (!updatedVideo) {
    return next(new ApiError(500, `video with id ${videoId} does not exist`));
  }


  res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details updated successfully")
    );
});

const getPublishedVideosByChannel = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { sortBy = "latest" } = req.query;

  if (!userId) {
    return next(new ApiError(400, "user id is missing"));
  }

  if (!isValidObjectId(userId)) {
    return next(new ApiError(400, "Invalid User ID"));
  }

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $match: {
        isPublished: true,
      },
    },
  ];

  // Dynamically add the $sort stage based on sortBy
  if (sortBy === "latest") {
    pipeline.push({
      $sort: { createdAt: -1 }, // Sort by newest first
    });
  } else if (sortBy === "oldest") {
    pipeline.push({
      $sort: { createdAt: 1 }, // Sort by oldest first
    });
  } else if (sortBy === "popular") {
    pipeline.push({
      $sort: { views: -1 }, // Sort by highest views
    });
  } else {
    throw new Error(`Invalid sortBy value: ${sortBy}`);
  }

  // Add the $project stage
  pipeline.push({
    $project: {
      thumbnail: 1,
      title: 1,
      duration: 1,
      isPublished: 1,
      description: 1,
      views: 1,
      createdAt: 1,
      updatedAt: 1,
      owner: 1,
    },
  });

  const videos = await Video.aggregate(pipeline);

  

  if (!videos) {
    return next(new ApiError("user does not exist in the DB"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videos,
        "all the published videos of the channel fetched successfully"
      )
    );
});
const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) {
    return next(new ApiError(400, "Video id is required"));
  }
  if (!isValidObjectId(videoId)) {
    return next(new ApiError(400, "Invalid video id"));
  }
  const video = await Video.findById(videoId);
  if(!video){
    return next(new ApiError(404, `video with id ${videoId} not found`));
  }
  if (req.user._id.toString() !== video.owner.toString()) {
    return next(
      new ApiError(
        401,
        "You do not have permission to perform this action on this resource"
      )
    );
  }
  const thumbnailPublicId = video.thumbnail.split("/").pop().split(".")[0];
  const videoPublicId = video.videoFile.split("/").pop().split(".")[0];

  await deleteFromCloudinary(thumbnailPublicId);
  await deleteFromCloudinary(videoPublicId);

  await Video.findByIdAndDelete(videoId);
  res.status(200).json(new ApiResponse(200, {},"Video deleted successfully"));
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!videoId){
    return next(new ApiError(400, "Video id is required"));
  }
  if(!isValidObjectId(videoId)){
    return next(new ApiError(400, "Invalid video id"));
  }
  const video = await Video.findById(videoId);
  if(!video){
    return next(new ApiError(404, `video with id ${videoId} not found`));
  }
  video.isPublished = !video.isPublished;
  await video.save({validateBeforeSave: false});
  res.status(200).json(new ApiResponse(200, video, "Video published status updated successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getPublishedVideosByChannel,
};

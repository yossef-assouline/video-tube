import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";

const toggleVideoLike = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;

    if (!videoId) {
      return next(new ApiError(400, "video id is missing."));
    }
  
    if (!isValidObjectId(videoId)) {
      return next(new ApiError(400, "invalid video id"));
    }
  
    const video = await Video.findById(videoId);
    if (!video) {
      return next(new ApiError(500, `video with id ${videoId} does not exist`));
    }
    //   console.log(req.user);
  
    // check if the video is already liked
    const alreadyLiked = await Like.findOne({
      likedBy: req.user._id,
      video: videoId,
    });
  
    if (alreadyLiked) {
      // remove like
      await Like.deleteOne(alreadyLiked);
      console.log("video like removed");
      return res.status(200).json(new ApiResponse(200, {}, "video like removed"));
    }
  
    const likeDoc = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    console.log("video like added");
    res.status(200).json(new ApiResponse(200, likeDoc, "video like added"));
});

const toggleCommentLike = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;

    console.log("commentId", commentId);

    if (!commentId) {
      return next(new ApiError(400, "video id is missing."));
    }
  
    if (!isValidObjectId(commentId)) {
      return next(new ApiError(400, "invalid video id"));
    }
  
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(
        new ApiError(500, `comment with id ${commentId} does not exist`)
      );
    }
    //   console.log(req.user);
  
    // check if the comment is already liked
    const alreadyLiked = await Like.findOne({
      likedBy: req.user._id,
      comment: commentId,
    });
  
    if (alreadyLiked) {
      // remove like
      await Like.deleteOne(alreadyLiked);
  
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "comment like removed"));
    }
  
    const likeDoc = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
  
    res.status(200).json(new ApiResponse(200, likeDoc, "comment like added"));
});

// const toggleTweetLike = asyncHandler(async (req, res, next) => {
//   const { tweetId } = req.params;
//   //TODO: toggle like on tweet
// });

const getLikedVideos = asyncHandler(async (req, res, next) => {
  //TODO: get all liked videos
  if(!isValidObjectId(req.user._id)) {
    throw new ApiError(400, "Invalid user id");
  }
  const pipeline = [
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $match: {
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
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
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
          {
            $project: {
              thumbnail: 1,
              duration: 1,
              views: 1,
              title: 1,
              createdAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video: {
          $first: "$video",
        },
      },
    },
    {
      $group: {
        _id: null,
        video: {
          $push: "$video",
        },
      },
    },
    {
      $project: {
        video: 1,
        _id: 0,
      },
    },
  ];
  const likedVideos = await Like.aggregate(pipeline);

  if (!likedVideos) {
    return next(new ApiError(404, "No Likes Found!"));
  }
  // console.log("Videos liked by the user", likedVideos);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos[0]?.video.reverse() || [],
        "liked videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleVideoLike, getLikedVideos };

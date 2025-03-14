import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshToken:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, username, password } = req.body;
  //validation
  
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (user) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded on cloudinary");
  } catch (error) {
    console.log("Error uploading avatar on cloudinary", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Cover image uploaded on cloudinary");
  } catch (error) {
    console.log("Error uploading cover image on cloudinary", error);
    throw new ApiError(500, "Failed to upload cover image");
  }

  try {
    const newUser = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatar.url || "",
      coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User creation failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering user and images were deleted"
    );
  }
});

const findUser = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found successfully"));
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ApiError(400, "User does not exist, please create an account.")
      );
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return next(new ApiError(400, "Invalid user credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!loggedInUser) {
      throw new ApiError(500, "Something went wrong while logging in user");
    }
    //set refresh token in cookie
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      domain: process.env.NODE_ENV === "development" ? "localhost" : process.env.DOMAIN,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000  // 24 hours in milliseconds
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.log("Error logging in user", error);
    throw new ApiError(500, "Failed to log in user");
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to refresh access token");
  }
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  
  const { fullname, email, username } = req.body;
  const user = await User.findById(req.user._id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname: fullname || user.fullname,
        email: email || user.email,
        username: username || user.username,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account details updated successfully"));
});
const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.findById(req.user?._id);
  const publicId = user.avatar.split("/").pop().split(".")[0];
  await deleteFromCloudinary(publicId);
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});
const updateUserCoverImage = asyncHandler(async (req, res, next) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const publicId = user.coverImage.split("/").pop().split(".")[0];
  await deleteFromCloudinary(publicId);
  const coverImage = await uploadOnCloudinary(coverLocalPath);
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});
const getUserChannelProfile = asyncHandler(async (req, res, next) => {


  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$subscribers.subscriber"
              ]
            },
            then: true,
            else: false
          }
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        email: 1,
      },
    },
  ]);
  
  if (!channel?.length) {
    throw new ApiError(404, "Channel not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "Channel profile fetched successfully")
    );
});
const getWatchHistory = asyncHandler(async (req, res, next) => {
  const newPipeline = [
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $project: {
        _id: 0,
        watchHistory: {
          $ifNull: ["$watchHistory", []],
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        let: { watchHistoryIds: "$watchHistory" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$watchHistoryIds"],
              },
            },
          },
          {
            $addFields: {
              customOrder: {
                $indexOfArray: ["$$watchHistoryIds", "$_id"],
              },
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
                    userName: 1,
                    fullName: 1,
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
            $sort: {
              customOrder: 1, // Sort by the custom index to preserve the order
            },
          },
        ],
        as: "watchHistory",
      },
    },
  ];

  const user = await User.aggregate(newPipeline);
  // console.log(user)

  if (!user) {
    return next(new ApiError(401, "unauthorized access"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetched successfully"
      )
    );
});


export {
  registerUser,
  findUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory,
  getUserChannelProfile,
};

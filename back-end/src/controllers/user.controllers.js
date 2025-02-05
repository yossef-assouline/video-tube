import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res, next) => {
    const { fullname, email, username, password } = req.body
    //validation

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findOne({$or:[{email}, {username}]})
    if(user) {
        throw new ApiError(409, "User already exists with this email or username")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)
    
    
    const newUser = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        password,
        avatar: avatar.url || "",
        coverImage: coverImage?.url || ""
    })
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }
    console.log("USER CREATED", createdUser)
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const findUser = asyncHandler(async (req, res, next) => {
    const { email } = req.query
    console.log("EMAIL", email)
    // Add validation
    // if (!email?.trim()) {
    //     throw new ApiError(400, "Email is required")
    // }
    
    const user = await User.findOne({ email })
    
    // Handle case when user is not found
    // if (!user) {
    //     throw new ApiError(404, "User not found")
    // }

    console.log("USER FOUND", user)
    if(user) {
    return res.status(200).json(new ApiResponse(200, user, "User found successfully"))}
})

export { registerUser, findUser }




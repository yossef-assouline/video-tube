import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

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

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
    let avatar
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("Avatar uploaded on cloudinary")
    } catch (error) {
        console.log("Error uploading avatar on cloudinary", error)
        throw new ApiError(500, "Failed to upload avatar")
    }

    let coverImage
    try {
        coverImage = await uploadOnCloudinary(coverLocalPath)
        console.log("Cover image uploaded on cloudinary")
    } catch (error) {
        console.log("Error uploading cover image on cloudinary", error)
        throw new ApiError(500, "Failed to upload cover image")
    }


    
    
    try {
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
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )
    } catch (error) {
        console.log("User creation failed")
        if(avatar) {    
            await deleteFromCloudinary(avatar.public_id)
        }
        if(coverImage) {
            await deleteFromCloudinary(coverImage.public_id)
        }
        throw new ApiError(500, "Something went wrong while registering user and images were deleted")
    }
})

const findUser = asyncHandler(async (req, res, next) => {
    const { email } = req.query  
    const user = await User.findOne({ email })
    if(user) {
    return res.status(200).json(new ApiResponse(200, user, "User found successfully"))}
})

export { registerUser, findUser }




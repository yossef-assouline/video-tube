import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: { required: true, type: String, unique: true, lowercase: true, trim: true, index: true },
        email: { required: true, type: String, unique: true, lowercase: true, trim: true },
        fullname: { required: true, type: String, trim: true, index: true },
        avatar: { required: true, type: String, },
        coverImage: { required: false, type: String },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: { type: String }
    }
)

export const User = mongoose.model("User", userSchema)

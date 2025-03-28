import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _res, next) => {
  try {
    let token;
    const isMobile = req.headers['x-device-type'] === 'mobile';


    
    if (isMobile) {
      // For mobile clients, prioritize Authorization header or x-auth-token
      token = req.header("Authorization")?.replace("Bearer ", "") || 
              req.header("x-auth-token");
              

    } else {
      // For desktop clients, prioritize cookies
      token = req.cookies?.accessToken || null;

    }

   
 
    if (!token) {
      throw new ApiError(401, `Unauthorized request - No token provided for ${isMobile ? 'mobile' : 'desktop'} client`);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.id || decodedToken._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, "Invalid access token");
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Access token expired");
    }
    throw error;
  }
});

export { verifyJWT };
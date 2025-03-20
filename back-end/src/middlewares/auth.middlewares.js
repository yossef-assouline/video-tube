import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, _res, next) => {
  try {
    const token = req.cookies?.accessToken || // Check cookies first
      req.header("Authorization")?.replace("Bearer ", "") || // Check Authorization header
      req.header("x-auth-token") || // Check custom header
      req.query.accessToken; // Check URL params as last resort

    console.log("Auth sources:", {
      cookies: req.cookies,
      authHeader: req.header("Authorization"),
      xAuthToken: req.header("x-auth-token"),
      queryToken: req.query.accessToken
    });
 
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
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
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


export const protectedRoute = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decoded?.id).select("-password -refreshToken");
        if (!user) throw new ApiError(401, "Unauthorized: User not found");
        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid or expired token");
    }
});







import crypto from "crypto";
import dotenv from "dotenv";

import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from "../mailtrap/email.service.js";

dotenv.config({
    path: 'backend/.env'
});

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, `Failed to generate access token: ${error.message}`);
    }
}

const setCookies = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

const signup = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new ApiError(400, "Email, password and name are required");

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) throw new ApiError(400, "User already exists");

    try {
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            email,
            password,
            name,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });

        const { accessToken } = await generateAccessToken(user._id);
        setCookies(res, accessToken);

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) throw new ApiError(404, "User not found");

        await sendVerificationEmail(createdUser.email, verificationToken);


        res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));

    } catch (error) {
        console.error("Error during user registration:", error);
        throw new ApiError(500, "Internal Server Error");
    }
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) throw new ApiError(400, "Code is required");

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) throw new ApiError(400, "Invalid verification code");

        if (user.isVerified) {
            throw new ApiError(400, "Email is already verified");
        }

        if (user.verificationToken !== code) {
            throw new ApiError(400, "Invalid verification code");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json(new ApiResponse(200, user, "Email verified successfully"));
    } catch (error) {
        console.error("Error during email verification:", error);
        throw new ApiError(500, "Internal Server Error");
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email and password are required");

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) throw new ApiError(404, "User not found");

        if (!user.isVerified) {
            throw new ApiError(403, "Please verify your email before logging in");
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        const { accessToken } = await generateAccessToken(user._id);
        setCookies(res, accessToken);

        user.lastLogin = Date.now();
        await user.save();

        const updatedUser = await User.findById(user._id).select("-password");
        if (!updatedUser) throw new ApiError(404, "User not found");

        res.status(200).json(new ApiResponse(200, updatedUser, "Login successful"));
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Only throw generic error for unexpected errors
        console.error("Unexpected error during login:", error);
        throw new ApiError(500, "Internal Server Error");
    }
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json(new ApiResponse(200, "Logout successful"));
})

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Security: Don't reveal if user exists
        if (!user) {
            return res.status(200).json(
                new ApiResponse(200, null, "If an account exists with this email, a new verification code has been sent.")
            );
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(200).json(
                new ApiResponse(200, null, "This email is already verified. You can login now.")
            );
        }

        // Generate new verification token (6-digit OTP)
        const newVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Update user with new token and expiry
        user.verificationToken = newVerificationToken;
        user.verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Send new verification email
        await sendVerificationEmail(user.email, newVerificationToken);

        return res.status(200).json(
            new ApiResponse(200, null, "If an account exists with this email, a new verification code has been sent.")
        );

    } catch (error) {
        console.error("Error resending verification email:", error);
        throw new ApiError(500, "Failed to resend verification email");
    }
});

const checkAuth = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Security: Don't reveal if user exists
        if (!user) {
            return res.status(200).json(
                new ApiResponse(200, null, "If an account exists with this email, a password reset link has been sent.")
            );
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Create reset URL with token as query parameter
        // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // Send password reset email with LINK
        await sendPasswordResetEmail(user.email, resetUrl);

        return res.status(200).json(
            new ApiResponse(200, null, "If an account exists with this email, a password reset link has been sent.")
        );

    } catch (error) {
        console.error("Error in forgot password:", error);
        throw new ApiError(500, "Failed to process password reset request");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) throw new ApiError(400, "Token is required");
    if (!newPassword) throw new ApiError(400, "New password is required");
    if (newPassword.length < 6) throw new ApiError(400, "Password must be at least 6 characters long");

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) throw new ApiError(400, "Invalid or expired token");

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        await sendPasswordResetSuccessEmail(user.email, user.name);

        return res.status(200).json(
            new ApiResponse(200, null, "Password reset successful")
        );

    } catch (error) {
        console.error("Error in reset password:", error);
        throw new ApiError(500, "Failed to reset password");
    }
})

export {
    signup,
    verifyEmail,
    logout,
    resendVerificationEmail,
    login,
    checkAuth,
    forgotPassword,
    resetPassword
}
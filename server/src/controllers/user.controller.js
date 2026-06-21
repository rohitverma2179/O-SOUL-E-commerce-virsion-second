import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail, getVerificationEmailTemplate } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    // Generate 6-digit OTP code and 15-minute expiry
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({
        fullName,
        email,
        password,
        role: role || "user",
        isVerified: false,
        verificationCode,
        verificationCodeExpiry
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Send email asynchronously
    try {
        await sendEmail({
            to: email,
            subject: "Verify your O'Soul Account",
            html: getVerificationEmailTemplate(fullName, verificationCode)
        });
    } catch (err) {
        console.error("Error sending verification email during registration: ", err);
        // Do not throw error here, so the user registration record is created and they can resend verification
    }

    return res.status(201).json(
        new ApiResponse(201, { user: createdUser, unverified: true }, "User registered. Please verify your email.")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // If password exists, verify it (Google-only accounts might not have a password set)
    if (user.password) {
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }
    } else {
        throw new ApiError(400, "This email is registered using Google Login. Please sign in with Google.");
    }

    // Check if email is verified
    if (!user.isVerified) {
        // Generate new OTP code and 15-minute expiry
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = verificationCodeExpiry;
        await user.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                to: email,
                subject: "Verify your O'Soul Account",
                html: getVerificationEmailTemplate(user.fullName, verificationCode)
            });
        } catch (err) {
            console.error("Error sending verification email during login: ", err);
        }

        return res.status(403).json(
            new ApiResponse(403, { unverified: true, email }, "Please verify your email before logging in. A new OTP has been sent.")
        );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

// Verify email with OTP
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        throw new ApiError(400, "Email and verification code are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Email is already verified")
        );
    }

    if (user.verificationCode !== code || new Date(user.verificationCodeExpiry) < new Date()) {
        throw new ApiError(400, "Invalid or expired verification code");
    }

    // Set as verified and clear verification code fields
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    // Directly log the user in
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "Email verified & user logged in successfully"
            )
        );
});

// Google Login Endpoint
const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(400, "Google ID Token is required");
    }

    const googleClient = new OAuth2Client(process.env.google_client_id);
    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.google_client_id
        });
        payload = ticket.getPayload();
    } catch (err) {
        console.error("Google token verification failed: ", err);
        throw new ApiError(400, "Invalid Google credentials");
    }

    const { email, name } = payload;

    if (!email) {
        throw new ApiError(400, "Could not fetch email from Google account");
    }

    let user = await User.findOne({ email });

    if (!user) {
        // Create a new password-less Google user
        user = await User.create({
            fullName: name || "Google User",
            email,
            isVerified: true // Google accounts are pre-verified
        });
    } else if (!user.isVerified) {
        // If the user already existed (e.g. registered manually) but wasn't verified, mark them verified now
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "Google login successful"
            )
        );
});

// Fetch current user details
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});

// Resend verification OTP code
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            to: email,
            subject: "Verify your O'Soul Account",
            html: getVerificationEmailTemplate(user.fullName, verificationCode)
        });
    } catch (err) {
        console.error("Error sending verification email during resend: ", err);
        throw new ApiError(500, "Failed to send verification code email");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Verification code resent successfully")
    );
});

export { registerUser, loginUser, logoutUser, verifyEmail, googleLogin, getCurrentUser, resendOTP };

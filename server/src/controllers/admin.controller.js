import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { HomepageContent } from "../models/homepage.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// User Management
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;
    if (!["user", "admin", "superadmin"].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
});

// Homepage Management (CMS)
const getHomepageContent = asyncHandler(async (req, res) => {
    const content = await HomepageContent.find();
    return res.status(200).json(new ApiResponse(200, content, "Homepage content fetched successfully"));
});

const updateHomepageSection = asyncHandler(async (req, res) => {
    const { sectionName, content } = req.body;

    const updatedContent = await HomepageContent.findOneAndUpdate(
        { sectionName },
        { sectionName, content },
        { upsert: true, new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedContent, `${sectionName} updated successfully`));
});

// Stats for Dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: { $in: ["admin", "superadmin"] } });

    // Mocking some other stats for the "Rich Aesthetics" dashboard
    const stats = {
        totalUsers,
        adminCount,
        totalSales: 45230,
        recentOrders: 12,
        activeVisitors: 154
    };

    return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

export {
    getAllUsers,
    updateUserRole,
    getHomepageContent,
    updateHomepageSection,
    getDashboardStats
};

import { asyncHandler } from "../utils.js/asyncHandler.utils.js";
import { apiError } from "../utils.js/apiError.utils.js";
import { apiResponse } from "../utils.js/apiResponse.utils.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

const getUserStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new apiError(401, "User not authenticated");
        }

        // Get all job application counts by status and total jobs
        const [totalAppliedJobs, totalInterviews, totalPending, totalRejected, totalSelected, totalJobs] = await Promise.all([
            Application.countDocuments({ applicant: userId }),
            Application.countDocuments({ applicant: userId, status: 'interview' }),
            Application.countDocuments({ applicant: userId, status: 'pending' }),
            Application.countDocuments({ applicant: userId, status: 'rejected' }),
            Application.countDocuments({ applicant: userId, status: 'selected' }),
            Job.countDocuments({}) // Count all jobs in the system
        ]);

        // Calculate profile score based on various factors
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found");
        }

        let profileScore = 0;

        // Add points for each completed profile section
        if (user?.profile?.bio) profileScore += 20;
        if (user?.profile?.skills?.length > 0) profileScore += 20;
        if (user?.profile?.resume) profileScore += 20;
        if (user?.profile?.avatar) profileScore += 10;
        if (user?.profile?.coverImage) profileScore += 10;
        if (user?.phoneNumber) profileScore += 10;
        if (user?.email) profileScore += 10;

        return res.status(200).json(
            new apiResponse(200, {
                totalAppliedJobs,
                totalInterviews,
                totalPending,
                totalRejected,
                totalSelected,
                totalJobs,
                profileScore
            }, "User stats fetched successfully")
        );
    } catch (error) {
        console.error("Error in getUserStats:", error);
        throw new apiError(500, error.message || "Error fetching user stats");
    }
});

const getApplicationTrends = asyncHandler(async (req, res) => {
    console.log("getApplicationTrends");
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new apiError(401, "User not authenticated");
        }

        // Get application trends for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trends = await Application.aggregate([
            {
                $match: {
                    applicant: userId,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        // Format the trends data
        const formattedTrends = trends.map(trend => ({
            month: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}`,
            count: trend.count
        }));

        return res.status(200).json(
            new apiResponse(200, formattedTrends, "Application trends fetched successfully")
        );
    } catch (error) {
        console.error("Error in getApplicationTrends:", error);
        throw new apiError(500, error.message || "Error fetching application trends");
    }
});

const getUserSkills = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new apiError(401, "User not authenticated");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Get user's skills and their levels
        const skillsData = user.profile?.skills?.map(skill => ({
            name: skill,
            level: 80 // Default level, can be modified based on user's experience or other factors
        })) || [];

        return res.status(200).json(
            new apiResponse(200, skillsData, "User skills fetched successfully")
        );
    } catch (error) {
        console.error("Error in getUserSkills:", error);
        throw new apiError(500, error.message || "Error fetching user skills");
    }
});
const getGlobalStats = asyncHandler(async (req, res) => {
    try {
        // Get total jobs
        const totalJobs = await Job.countDocuments();

        // Get total users
        const totalUsers = await User.countDocuments();

        // Get total applications
        const totalApplications = await Application.countDocuments();

        // Get total companies
        const totalCompanies = await Company.countDocuments();

        // Calculate average profile score
        const users = await User.find({}, 'profileScore');
        const totalScore = users.reduce((sum, user) => sum + (user.profileScore || 0), 0);
        const averageProfileScore = users.length > 0 ? Math.round((totalScore / users.length) * 100) / 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                totalUsers,
                totalApplications,
                totalCompanies,
                averageProfileScore
            }
        });
    } catch (error) {
        console.error('Error fetching global stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching global statistics',
            error: error.message
        });
    }
});

export {
    getUserStats,
    getApplicationTrends,
    getUserSkills,
    getGlobalStats
}; 
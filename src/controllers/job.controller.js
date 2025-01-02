import { Job } from "../models/job.model.js";
import { apiError } from "../utils.js/apiError.utils.js";
import { asyncHandler } from "../utils.js/asyncHandler.utils.js";
import { apiResponse } from "../utils.js/apiResponse.utils.js";
import mongoose from 'mongoose';
import { Company } from "../models/company.model.js";

const postJob = asyncHandler(async (req, res) => {
    const { title, description, requirements, salary, location, jobType, position, companyId, experience } = req.body;

    if (!title || !description || !requirements || !salary || !location || !experience || !jobType || !position || !companyId) {
        throw new apiError(400, "All fields are required");
    }

    // Validate companyId
    const company = await Company.findById(companyId);
    if (!company) {
        throw new apiError(404, "Company not found");
    }

    // Create the job
    const newJob = await Job.create({
        title,
        description,
        requirements: requirements.split(",").map(req => req.trim()),
        salary: Number(salary),
        location: Array.isArray(location) ? location : location.split(",").map(loc => loc.trim()),
        jobType,
        experience,
        position,
        company: companyId,
        created_by: req.user._id,
    });

    return res.status(201).json(new apiResponse(201, newJob, "Job Posted Successfully"));
});
const getAllJobs = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword || "";
    const query = {
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }
        ]
    };

    const jobs = await Job.find(query)
        .populate({
            path: "company",
            select: "companyName description website location logo userId",
        })
        .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
        throw new apiError(404, "No jobs found"); s
    }

    return res.status(200).json(new apiResponse(200, jobs, "Jobs Retrieved Successfully"));
});
const getJobById = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new apiError(400, "Invalid Job ID");
    }

    const job = await Job.findById(jobId).populate({ path: "company" }).populate({ path: "applications"});
    if (!job) {
        throw new apiError(404, "Job not found");
    }

    return res.status(200).json(new apiResponse(200, job, "Job Retrieved Successfully"));
});
const getJobsByAdmin = asyncHandler(async (req, res) => {
    const adminId = req.user?._id;

    // Validate adminId
    if (!adminId) {
        throw new apiError(403, "Admin ID not found");
    }

    const jobs = await Job.find({ created_by: adminId })
        .populate({ path: 'company' });

    if (!jobs || jobs.length == 0) {
        throw new apiError(404, "No jobs found");
    }

    return res.status(200).json(new apiResponse(200, jobs, "Jobs Retrieved Successfully"));
});
export {
    postJob,
    getAllJobs,
    getJobById,
    getJobsByAdmin
};

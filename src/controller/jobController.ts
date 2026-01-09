import {
  createJobService,
  deleteJobService,
  getJobsService,
  likeOrDislikeJobService,
  updateJobService,
  updateJobStatusService,
} from "../services/jobService";
import { NotificationType } from "../database/models/notification";
import { sendNotificationService } from "../services/notificationService";
import User, { USER_ROLES } from "../database/models/user";
import Job from "../database/models/job";
import LikeJob from "../database/models/likeJob";

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      listingType = "own",
      category,
      type,
      district,
      educationLevel,
      experienceRequired,
      salaryMin,
      salaryMax,
      isFavourite,
      sortBy = "latest",
    } = req.query;

    const userId = req.user ? req.user.id : null;

    const result = await getJobsService(
      userId,
      Number(page),
      Number(perPage),
      listingType || "all",
      {
        category,
        type,
        district,
        educationLevel,
        experienceRequired,
        salaryMin,
        salaryMax,
        isFavourite,
      },
      sortBy
    );

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Job Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch jobs",
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      userId: req.user.id,
    };

    const job = await createJobService(jobData);

    // Notify Super Admin
    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "New Job Posted",
      description: `A new job "${job.title}" has been posted. Please review.`,
      senderId: req.user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.JOB,
      referenceId: job.id,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: job,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "mobile", "role"],
        },
      ],
    });

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const likeCount = await LikeJob.count({ where: { jobId: job.id } });

    let isLiked = false;

    if (userId) {
      const liked = await LikeJob.findOne({
        where: { userId, jobId: job.id },
      });
      isLiked = !!liked;
    }

    return res.json({
      success: true,
      message: "Job fetched successfully",
      data: {
        ...job.toJSON(),
        likeCount,
        isLiked,
      },
    });
  } catch (err) {
    console.error("Get Job Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const result = await updateJobService(req.params.id, req.user, req.body);

    return res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const result = await deleteJobService(req.params.id, req.user.id);
    res.status(result.statusCode).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeOrDislikeJob = async (req, res) => {
  try {
    const result = await likeOrDislikeJobService(req.user.id, req.params.jobId);

    return res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, reason } = req.body;

    const job = await updateJobStatusService(jobId, status, reason);

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Send notification to job creator
    await sendNotificationService({
      title: `Your Job is ${status}`,
      description:
        status === "approved"
          ? "Your job has been approved!"
          : `Your job was rejected. Reason: ${reason}`,
      senderId: req.user.id,
      receiverId: job.userId,
      referenceType: NotificationType.JOB,
      referenceId: job.id,
    });

    res.json({
      success: true,
      message: "Job status updated successfully",
      data: job,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

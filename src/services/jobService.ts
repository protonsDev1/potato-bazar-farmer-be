import { Op } from "sequelize";
import Job, { JOB_STATUS } from "../database/models/job";
import User, { USER_ROLES } from "../database/models/user";
import { canUpdateResource } from "../utils/commonCode";
import { PERMISSIONS } from "../utils/constants/permissions";
import LikeJob from "../database/models/likeJob";
import { sendNotificationService } from "./notificationService";
import { NotificationType } from "../database/models/notification";
import SubAdminPermission from "../database/models/subAdminPermission";

export const getJobsService = async (
  userId: number,
  page: number,
  limit: number,
  listingType: "own" | "others" | "all" = "own",
  filters: {
    category?: string;
    type?: string;
    state?: string;
    district?: string;
    educationLevel?: string;
    experienceRequired?: string;
    salaryMin?: string;
    salaryMax?: string;
    isFavourite?: string;
    search?: string;
  },
  sortBy: string = "latest",
) => {
  const offset = (page - 1) * limit;

  const where: any = {};
  const userWhere: any = {};

  if (filters.search && filters.search.trim() !== "") {
    const searchTerm = `%${filters.search.trim()}%`;

    where[Op.or] = [
      { title: { [Op.iLike]: searchTerm } },
      { companyName: { [Op.iLike]: searchTerm } },
      { category: { [Op.iLike]: searchTerm } },
    ];
  }

  if (!userId) {
    listingType = "all"; // force all for non-auth users
  }

  if (listingType === "own") {
    where.userId = userId;
  } else if (listingType === "others") {
    where.userId = { [Op.ne]: userId };
    where.status = "approved";
    where.isActive = true;
    userWhere.isActive = true;
    userWhere.isDeleted = false;
  }

  if (filters.category && filters.category !== "all") {
    where.category = { [Op.iLike]: filters.category };
  }

  if (filters.type && filters.type !== "all") {
    where.type = { [Op.iLike]: filters.type };
  }

  if (filters.state && filters.state !== "all") {
    where.state = { [Op.iLike]: filters.state };
  }

  if (filters.district && filters.district !== "all") {
    where.district = { [Op.iLike]: filters.district };
  }

  if (filters.educationLevel && filters.educationLevel !== "all") {
    where.educationLevel = { [Op.contains]: [filters.educationLevel] };
  }

  if (filters.experienceRequired && filters.experienceRequired !== "all") {
    where.experienceRequired = filters.experienceRequired;
  }

  if (filters.salaryMin) {
    where.salaryMin = { [Op.gte]: Number(filters.salaryMin) };
  }

  if (filters.salaryMax) {
    where.salaryMax = { [Op.lte]: Number(filters.salaryMax) };
  }

  let favouriteJobIds: number[] = [];

  if (filters.isFavourite === "true") {
    const likedJobs = await LikeJob.findAll({
      where: { userId },
      attributes: ["jobId"],
    });

    favouriteJobIds = likedJobs.map((l) => l.jobId);

    if (favouriteJobIds.length === 0) {
      return {
        total: 0,
        page,
        perPage: limit,
        totalPages: 0,
        jobs: [],
      };
    }

    where.id = { [Op.in]: favouriteJobIds };
  }

  let order: any = [["createdAt", "DESC"]];

  if (sortBy === "latest") {
    order = [["updatedAt", "DESC"]];
  } else if (sortBy === "oldest") {
    order = [["updatedAt", "ASC"]];
  }

  const userInclude = {
    model: User,
    as: "user",
    attributes: ["id", "name", "email", "mobile", "role", "pbVerified"],
    where: userWhere,
  };

  const { rows, count } = await Job.findAndCountAll({
    where,
    include: [userInclude],
    order,
    limit,
    offset,
  });

  const jobsWithCounts = await Promise.all(
    rows.map(async (job) => {
      const [likeCount, likedRecord] = await Promise.all([
        LikeJob.count({ where: { jobId: job.id } }),
        LikeJob.findOne({ where: { userId, jobId: job.id } }),
      ]);

      return {
        ...job.toJSON(),
        isLiked: !!likedRecord,
        likeCount,
      };
    }),
  );

  return {
    total: count,
    page,
    perPage: limit,
    totalPages: Math.ceil(count / limit),
    jobs: jobsWithCounts,
  };
};

export const createJobService = async (data) => {
  return await Job.create(data);
};

export const getJobByIdService = async (id, userId) => {
  const job = await Job.findByPk(id);

  if (!job) return null;

  const liked = await LikeJob.findOne({
    where: { userId, jobId: id },
  });

  return {
    ...job.toJSON(),
    isLiked: Boolean(liked),
  };
};

export const updateJobService = async (id, user, data) => {
  const job = await Job.findByPk(id);

  if (!job) {
    return {
      success: false,
      statusCode: 404,
      message: "Job not found",
    };
  }

  const hasPermission = await canUpdateResource(
    user,
    job.userId,
    PERMISSIONS.JOBS,
  );

  if (!hasPermission) {
    return {
      success: false,
      statusCode: 403,
      message: "You are not allowed to update this job",
    };
  }

  if (Object.keys(data).length === 1 && data.hasOwnProperty("isActive")) {
    await job.update({ isActive: data.isActive });
    return {
      statusCode: 200,
      success: true,
      message: "Job status updated successfully",
      data: job,
    };
  }

  if (job.status !== JOB_STATUS.PENDING) {
    data.status = JOB_STATUS.PENDING;

    // Notify Super Admin
    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Job Updated",
      description: `A job "${job.title}" has been updated. Please review.`,
      senderId: user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.JOB,
      referenceId: job.id,
    });
  }

  await job.update(data);

  return {
    success: true,
    statusCode: 200,
    message: "Job updated successfully",
    data: job,
  };
};

export const deleteJobService = async (id, userId, role) => {
  const job = await Job.findByPk(id);

  if (!job) {
    return {
      success: false,
      statusCode: 404,
      message: "Job not found",
    };
  }

  if (role === USER_ROLES.SUB_ADMIN) {
    const hasPermission = await SubAdminPermission.findOne({
      where: {
        userId,
        permission: { [Op.in]: [PERMISSIONS.JOBS] },
      },
    });

    if (!hasPermission) {
      return {
        success: false,
        statusCode: 403,
        message: "You cannot delete this job",
      };
    }
  } else if (role !== USER_ROLES.SUPER_ADMIN && job.userId !== userId) {
    return {
      success: false,
      statusCode: 403,
      message: "You cannot delete this job",
    };
  }

  await job.destroy();

  return {
    success: true,
    statusCode: 200,
    message: "Job deleted successfully",
  };
};

export const likeOrDislikeJobService = async (userId, jobId) => {
  const job = await Job.findByPk(jobId);

  if (!job) {
    return { success: false, message: "Job not found" };
  }

  const existing = await LikeJob.findOne({ where: { userId, jobId } });

  if (existing) {
    await existing.destroy();
    return { success: true, message: "Job unliked successfully" };
  } else {
    await LikeJob.create({ userId, jobId });
    return { success: true, message: "Job liked successfully" };
  }
};

export const updateJobStatusService = async (id, status, reason) => {
  const job = await Job.findByPk(id);

  if (!job) return null;

  job.status = status;
  job.reason = status === JOB_STATUS.REJECTED ? reason : null;

  await job.save();

  return job;
};

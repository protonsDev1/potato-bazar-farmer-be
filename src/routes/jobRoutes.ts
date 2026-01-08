import express from "express";
import { createValidator } from "express-joi-validation";
import {
  authMiddleware,
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  likeOrDislikeJob,
  updateJob,
  updateJobStatus,
} from "../controller/jobController";

import {
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from "../validation/jobValidation";

import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

// Get all jobs
router.get("/", optionalAuthMiddleware, getJobs);

// Get single job
router.get("/:id", optionalAuthMiddleware, getJobById);

// Create job
router.post("/", authMiddleware, validator.body(createJobSchema), createJob);

// Update job
router.put("/:id", authMiddleware, validator.body(updateJobSchema), updateJob);

// Delete job
router.delete("/:id", authMiddleware, deleteJob);

// Like / Unlike job
router.post("/:jobId/like", authMiddleware, likeOrDislikeJob);

// Admin — update job status
router.put(
  "/update_status/:jobId",
  checkPermissionMiddleware(PERMISSIONS.JOBS),
  validator.body(updateJobStatusSchema),
  updateJobStatus
);

export default router;

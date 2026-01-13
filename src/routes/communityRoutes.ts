import express from "express";
import { createValidator } from "express-joi-validation";
import { adminMiddleware, authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createPost,
  getApprovedPosts,
  getAllForAdmin,
  approveRejectPost
} from "../controller/communityController";
import {
  createCommunityPostValidation,
  approveRejectValidation
} from "../validation/communityValidation";

const router = express.Router();
const validator = createValidator({});

// USER
router.post("/", authMiddleware, validator.body(createCommunityPostValidation), createPost);
router.get("/", authMiddleware, getApprovedPosts);

// ADMIN
router.get("/admin", authMiddleware, getAllForAdmin);
router.put(
  "/admin/:id",
  authMiddleware,
  validator.body(approveRejectValidation),
  approveRejectPost
);

export default router;

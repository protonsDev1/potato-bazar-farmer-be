import express from "express";
import { createValidator } from "express-joi-validation";
import {
  adminMiddleware,
  authMiddleware,
  checkPermissionMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createPost,
  getApprovedPosts,
  getAllForAdmin,
  approveRejectPost,
  getCommunityPostById,
  likeOrDislikeCommunityPost,
  deleteCommunityPost,
  postCommentInCommunityPost,
  deleteCommentOnPost,
  getAllComments,
  updatePost,
} from "../controller/communityController";
import {
  createCommunityPostValidation,
  approveRejectValidation,
  updateCommunityPostValidation,
} from "../validation/communityValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createCommunityPostValidation),
  createPost,
);

router.post("/toggle-like/:id", authMiddleware, likeOrDislikeCommunityPost);
router.post("/comment/:id", authMiddleware, postCommentInCommunityPost);
router.get("/", authMiddleware, getApprovedPosts);

// ADMIN
router.get(
  "/admin",
  checkPermissionMiddleware(PERMISSIONS.COMMUNITY),
  getAllForAdmin,
);

router.get("/comments/:id", authMiddleware, getAllComments);

router.delete("/comment/:id", authMiddleware, deleteCommentOnPost);

router.put(
  "/admin/:id",
  checkPermissionMiddleware(PERMISSIONS.COMMUNITY),
  validator.body(approveRejectValidation),
  approveRejectPost,
);

router.put(
  "/:id",
  authMiddleware,
  validator.body(updateCommunityPostValidation),
  updatePost,
);

router.get("/:id", authMiddleware, getCommunityPostById);
router.delete("/:id", authMiddleware, deleteCommunityPost);

export default router;

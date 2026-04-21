import express from "express";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  createVideoHub,
  getAllVideoHubs,
  getVideoHubById,
  updateVideoHub,
  deleteVideoHub,
  createVideoHubCategory,
  getAllVideoHubCategories,
  deleteVideoHubCategory,
} from "../controller/videoHubController";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();

// Category Routes
router.post(
  "/category",
  checkPermissionMiddleware(PERMISSIONS.VIDEO_HUB),
  createVideoHubCategory
);

router.get("/category",authMiddleware, getAllVideoHubCategories);

router.delete(
  "/category/:id",
  checkPermissionMiddleware(PERMISSIONS.VIDEO_HUB),
  deleteVideoHubCategory
);

// Video Hub Routes
router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.VIDEO_HUB),
  createVideoHub
);

router.get("/",authMiddleware, getAllVideoHubs);

router.get("/:id", authMiddleware, getVideoHubById);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.VIDEO_HUB),
  updateVideoHub
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.VIDEO_HUB),
  deleteVideoHub
);

export default router;
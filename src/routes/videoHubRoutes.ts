import express from "express";
import { authMiddleware } from "../utils/userAuth";
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

const router = express.Router();

router.post("/",authMiddleware, createVideoHub);
router.get("/", authMiddleware, getAllVideoHubs);
router.get("/:id", authMiddleware, getVideoHubById);
router.put("/:id", authMiddleware, updateVideoHub);
router.delete("/:id", authMiddleware, deleteVideoHub);

// Category Routes
router.post("/category", authMiddleware, createVideoHubCategory);
router.get("/category", authMiddleware, getAllVideoHubCategories);
router.delete("/category/:id", authMiddleware, deleteVideoHubCategory);

export default router;

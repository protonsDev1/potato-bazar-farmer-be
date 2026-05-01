import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";

import {
  createLiveAuction,
  getMyLiveAuctions,
  getPublicLiveAuctions,
  getLiveAuctionById,
  updateLiveAuction,
  deleteLiveAuction,
  getAllLiveAuctionsForAdmin,
  updateAuctionStatus,
  submitInspectionReport,
} from "../controller/liveAuctionController";

import {
  createLiveAuctionSchema,
  inspectionReportSchema,
  updateAuctionStatusSchema,
  updateLiveAuctionSchema,
} from "../validation/liveAuctionValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

// Create
router.post(
  "/",
  authMiddleware,
  validator.body(createLiveAuctionSchema),
  createLiveAuction,
);

// My Auctions
router.get("/my", authMiddleware, getMyLiveAuctions);

// Public Auctions
router.get("/public", authMiddleware, getPublicLiveAuctions);

// Admin List
router.get(
  "/admin",
  authMiddleware,
  checkPermissionMiddleware(PERMISSIONS.LIVE_AUCTION),
  getAllLiveAuctionsForAdmin,
);

// Show
router.get("/:id", authMiddleware, getLiveAuctionById);

// Update
router.put(
  "/:id",
  authMiddleware,
  validator.body(updateLiveAuctionSchema),
  updateLiveAuction,
);

// Delete
router.delete("/:id", authMiddleware, deleteLiveAuction);

// 🔹 Admin: Update Status
router.put(
  "/:id/status",
  checkPermissionMiddleware(PERMISSIONS.LIVE_AUCTION),
  validator.body(updateAuctionStatusSchema),
  updateAuctionStatus,
);

// 🔹 Admin: Submit Inspection
router.put(
  "/:id/inspection",
  checkPermissionMiddleware(PERMISSIONS.LIVE_AUCTION),
  validator.body(inspectionReportSchema),
  submitInspectionReport,
);

export default router;

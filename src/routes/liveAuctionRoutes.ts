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
} from "../controller/liveAuctionController";

import {
  createLiveAuctionSchema,
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

export default router;

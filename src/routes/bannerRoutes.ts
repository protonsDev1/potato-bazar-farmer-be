import express from "express";

import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import {
  createOrUpdateBanner,
  getBanner,
} from "../controller/bannerController";

const router = express.Router();

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.CONTENT_MANAGEMENT),
  createOrUpdateBanner
);

router.get("/", authMiddleware, getBanner);

export default router;

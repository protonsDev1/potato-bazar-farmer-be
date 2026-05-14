import express from "express";
import {
  exportMobileUsersReport,
  getMobileUsersSummary,
} from "../controller/reportController";
import { adminOrSubAdminMiddleware, authMiddleware } from "../utils/userAuth";

const router = express.Router();

router.get(
  "/mobile-users/export",
authMiddleware,
  exportMobileUsersReport
);

router.get(
  "/mobile-users/summary",
  adminOrSubAdminMiddleware,
  getMobileUsersSummary
);

export default router;

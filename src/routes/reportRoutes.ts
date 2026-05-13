import express from "express";
import {
  exportMobileUsersReport,
  getMobileUsersSummary,
} from "../controller/reportController";
import { adminOrSubAdminMiddleware } from "../utils/userAuth";

const router = express.Router();

router.get(
  "/mobile-users/export",
  adminOrSubAdminMiddleware,
  exportMobileUsersReport
);

router.get(
  "/mobile-users/summary",
  adminOrSubAdminMiddleware,
  getMobileUsersSummary
);

export default router;

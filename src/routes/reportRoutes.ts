import express from "express";
import {
  exportMobileUsersReport,
  getMobileUsersSummary,
} from "../controller/reportController";
import { superAdminOrSubAdminMiddleware } from "../utils/userAuth";

const router = express.Router();

router.get(
  "/mobile-users/export",
  superAdminOrSubAdminMiddleware,
  exportMobileUsersReport
);

router.get(
  "/mobile-users/summary",
  superAdminOrSubAdminMiddleware,
  getMobileUsersSummary
);

export default router;

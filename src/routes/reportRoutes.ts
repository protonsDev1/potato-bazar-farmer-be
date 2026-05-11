import express from "express";
import { exportMobileUsersReport } from "../controller/reportController";
import { superAdminOrSubAdminMiddleware } from "../utils/userAuth";

const router = express.Router();

router.get(
  "/mobile-users/export",
  superAdminOrSubAdminMiddleware,
  exportMobileUsersReport
);

export default router;

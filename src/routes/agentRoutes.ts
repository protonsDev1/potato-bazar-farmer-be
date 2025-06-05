import express from "express";
import { createValidator } from "express-joi-validation";
import { authMiddleware } from "../utils/userAuth";
import {
  getAgentDashboardStats,
  getAgentPerformance,
  getAllRegisteredUsers,
  getRecentRegisteredUsers,
} from "../controller/agent";

const router = express.Router();
const validator = createValidator({});

router.get("/all_registration", authMiddleware, getAllRegisteredUsers);
router.get("/recent_registration", authMiddleware, getRecentRegisteredUsers);
router.get("/performance",authMiddleware,getAgentPerformance);
router.get("/dashboard_stats",authMiddleware,getAgentDashboardStats);

export default router;
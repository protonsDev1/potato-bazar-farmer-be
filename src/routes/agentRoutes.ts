import express from "express";
import { createValidator } from "express-joi-validation";

import { adminMiddleware, authMiddleware } from "../utils/userAuth";
import {
  deleteAgent,
  getAgentDashboardStats,
  getAgentDetails,
  getAgentPerformance,
  getAllAgentPerformance,
  getAllRegisteredUsers,
  getRecentRegisteredUsers,
  getTopAgents,
  listAgents,
  resetPasswordForAgent,
  updateAgent,
} from "../controller/agent";
import { updateAgentSchema } from "../validation/agentValidation";

const router = express.Router();
const validator = createValidator({});

router.get("/all_registration", authMiddleware, getAllRegisteredUsers);
router.get("/recent_registration", authMiddleware, getRecentRegisteredUsers);
router.get("/performance", authMiddleware, getAgentPerformance);
router.get("/dashboard_stats", authMiddleware, getAgentDashboardStats);
router.get("/list", adminMiddleware, listAgents);
router.get("/details/:id", adminMiddleware, getAgentDetails);
router.put(
  "/update/:id",
  adminMiddleware,
  validator.body(updateAgentSchema),
  updateAgent
);
router.delete("/delete/:id", adminMiddleware, deleteAgent);
router.post("/:id/reset_password", adminMiddleware, resetPasswordForAgent);
router.get("/all_agent_performance", adminMiddleware, getAllAgentPerformance);
router.get("/top_performing_agents", adminMiddleware, getTopAgents);

export default router;

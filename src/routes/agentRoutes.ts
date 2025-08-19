import express from "express";
import { createValidator } from "express-joi-validation";

import { adminMiddleware, authMiddleware } from "../utils/userAuth";
import {
  addMonthlyTargetForAgent,
  createSupportTicket,
  deleteAgent,
  exportAgents,
  getAgentAllTickets,
  getAgentDashboardStats,
  getAgentDetails,
  getAgentPerformance,
  getAllAgentPerformance,
  getAllRegisteredUsers,
  getAllTicketDetails,
  getRecentRegisteredUsers,
  getTicketDetail,
  getTopAgents,
  listAgents,
  replyToSupportTicket,
  resetPasswordForAgent,
  retrieveAgentAllMonthTargets,
  updateAgent,
  updateStatusOfTicket,
} from "../controller/agent";
import {
  agentMonthlyTargetSchema,
  updateAgentSchema,
} from "../validation/agentValidation";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  adminReplySchema,
  helpAndSupportSchema,
  updateStatusSchema,
} from "../validation/userValidator";

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
  validateRequest(updateAgentSchema),
  updateAgent
);
router.delete("/delete/:id", adminMiddleware, deleteAgent);
router.post("/:id/reset_password", adminMiddleware, resetPasswordForAgent);
router.get(
  "/all_agent_performance/:agentId",
  adminMiddleware,
  getAllAgentPerformance
);
router.get("/top_performing_agents", adminMiddleware, getTopAgents);
router.post(
  "/create_ticket",
  authMiddleware,
  validator.body(helpAndSupportSchema),
  createSupportTicket
);
router.post(
  "/reply_on_ticket/:ticketId",
  adminMiddleware,
  validator.body(adminReplySchema),
  replyToSupportTicket
);
router.get("/ticket_detail/:ticketId", authMiddleware, getTicketDetail);
router.get("/all_tickets_detail", adminMiddleware, getAllTicketDetails);
router.put(
  "/update_status/:ticketId",
  authMiddleware,
  validator.body(updateStatusSchema),
  updateStatusOfTicket
);
router.get("/agent_tickets_detail", authMiddleware, getAgentAllTickets);
router.get("/export", adminMiddleware, exportAgents);
router.post(
  "/month_target",
  validator.body(agentMonthlyTargetSchema),
  adminMiddleware,
  addMonthlyTargetForAgent
);
router.get(
  "/month_target/:agentId",
  adminMiddleware,
  retrieveAgentAllMonthTargets
);

export default router;

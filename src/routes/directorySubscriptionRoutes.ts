import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createPlan,
  updatePlan,
  getPlans,
  getPlanById,
  getMySubscription,
  buyPlan,
} from "../controller/directorySubscriptionController";

import {
  authMiddleware,
  optionalAuthMiddleware,
  superAdminMiddleware,
} from "../utils/userAuth";

import {
  createDirectoryPlanSchema,
  updateDirectoryPlanSchema,
  idParamSchema,
  planIdParamSchema,
} from "../validation/directorySubscriptionValidation";

const router = express.Router();
const validator = createValidator({});

// ✅ ADMIN

// Create Plan
router.post(
  "/plans",
  superAdminMiddleware,
  validator.body(createDirectoryPlanSchema),
  createPlan,
);

// Update Plan
router.put(
  "/plans/:id",
  superAdminMiddleware,
  validator.params(idParamSchema),
  validator.body(updateDirectoryPlanSchema),
  updatePlan,
);

// List Plans
router.get("/plans", optionalAuthMiddleware, getPlans);

// Get Plan by ID
router.get(
  "/plans/:id",
  optionalAuthMiddleware,
  validator.params(idParamSchema),
  getPlanById,
);

// ✅ USER

// Get current subscription
router.get("/my-subscription", authMiddleware, getMySubscription);

// Buy Plan
router.post(
  "/buy/:planId",
  authMiddleware,
  validator.params(planIdParamSchema),
  buyPlan,
);

export default router;

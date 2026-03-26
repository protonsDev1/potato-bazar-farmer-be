import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createPlan,
  updatePlan,
  getPlans,
  getPlanById,
  getMySubscription,
  buyPlan,
} from "../controller/bannerAdController";

import {
  authMiddleware,
  optionalAuthMiddleware,
  superAdminMiddleware,
} from "../utils/userAuth";

import {
  createBannerPlanSchema,
  updateBannerPlanSchema,
  idParamSchema,
  planIdParamSchema,
} from "../validation/bannerAdValidation";

const router = express.Router();
const validator = createValidator({});

// ✅ ADMIN

router.post(
  "/plans",
  superAdminMiddleware,
  validator.body(createBannerPlanSchema),
  createPlan,
);

router.put(
  "/plans/:id",
  superAdminMiddleware,
  validator.params(idParamSchema),
  validator.body(updateBannerPlanSchema),
  updatePlan,
);

router.get("/plans", optionalAuthMiddleware, getPlans);

router.get(
  "/plans/:id",
  optionalAuthMiddleware,
  validator.params(idParamSchema),
  getPlanById,
);

// ✅ USER

router.get("/my-subscription", authMiddleware, getMySubscription);

router.post(
  "/buy/:planId",
  authMiddleware,
  validator.params(planIdParamSchema),
  buyPlan,
);

export default router;

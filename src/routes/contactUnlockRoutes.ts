import express from "express";
import { createValidator } from "express-joi-validation";

import {
  createModulePricing,
  updateModulePricing,
  getModulePricings,
  getModulePricingById,
  unlockContact,
} from "../controller/contactUnlockController";

import { authMiddleware, superAdminMiddleware } from "../utils/userAuth";

import {
  createModulePricingSchema,
  updateModulePricingSchema,
  idParamSchema,
  unlockContactSchema,
} from "../validation/contactUnlockValidation";

const router = express.Router();
const validator = createValidator({});

// ✅ ADMIN

router.post(
  "/module-pricing",
  superAdminMiddleware,
  validator.body(createModulePricingSchema),
  createModulePricing,
);

router.put(
  "/module-pricing/:id",
  superAdminMiddleware,
  validator.params(idParamSchema),
  validator.body(updateModulePricingSchema),
  updateModulePricing,
);

router.get("/module-pricing", getModulePricings);

router.get(
  "/module-pricing/:id",
  validator.params(idParamSchema),
  getModulePricingById,
);

// ✅ USER

router.post(
  "/unlock",
  authMiddleware,
  validator.body(unlockContactSchema),
  unlockContact,
);

export default router;

import { createValidator } from "express-joi-validation";
import express from "express";
import {
  authMiddleware,
  checkWebPermissionMiddleware,
} from "../../../utils/userAuth";
import {
  addSeedBrand,
  deleteSeedBrand,
  getActiveSeedBrands,
  getSeedBrands,
  updateSeedBrand,
} from "../../../controller/adminController/farmer/seedBrandController";
import {
  seedBrandCreateSchema,
  seedBrandUpdateSchema,
} from "../../../validation/adminValidation";
import { WEB_ACTIONS, WEB_MODULES } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(seedBrandCreateSchema),
  addSeedBrand
);
router.get("/", authMiddleware, getSeedBrands);
router.get("/active", getActiveSeedBrands);
router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(seedBrandUpdateSchema),
  updateSeedBrand
);
router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteSeedBrand
);

export default router;

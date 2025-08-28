import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addBrandPreferenceReason,
  deleteBrandPreferenceReason,
  getActiveBrandPreferenceReasons,
  getBrandPreferenceReasons,
  updateBrandPreferenceReason,
} from "../../../controller/adminController/farmer/brandPreferenceReasonController";
import {
  brandPreferenceReasonCreateSchema,
  brandPreferenceReasonUpdateSchema,
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
  validator.body(brandPreferenceReasonCreateSchema),
  addBrandPreferenceReason
);
router.get("/", getBrandPreferenceReasons);
router.get("/active", getActiveBrandPreferenceReasons);
router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(brandPreferenceReasonUpdateSchema),
  updateBrandPreferenceReason
);
router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteBrandPreferenceReason
);

export default router;

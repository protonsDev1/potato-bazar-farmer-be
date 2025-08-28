import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { sowingMethodSchema } from "../../../validation/adminValidation";
import {
  addSowingMethod,
  deleteSowingMethod,
  getActiveSowingMethod,
  getSowingMethod,
  updateSowingMethod,
} from "../../../controller/adminController/farmer/sowingMethodController";
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
  validator.body(sowingMethodSchema),
  addSowingMethod
);

router.get("/", getSowingMethod);

router.get("/active", getActiveSowingMethod);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateSowingMethod
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteSowingMethod
);

export default router;

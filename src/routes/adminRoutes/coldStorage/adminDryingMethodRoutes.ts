import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";

import { WEB_ACTIONS, WEB_MODULES } from "../../../utils/constants/permissions";
import {
  addDryingMethods,
  deleteDryingMethod,
  getActiveDryingMethod,
  getDryingMethod,
  updateDryingMethod,
} from "../../../controller/adminController/coldStorage/dryingMethodController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(adminColdStorageSchema),
  addDryingMethods
);

router.get("/", getDryingMethod);

router.get("/active", getActiveDryingMethod);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateDryingMethod
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteDryingMethod
);

export default router;

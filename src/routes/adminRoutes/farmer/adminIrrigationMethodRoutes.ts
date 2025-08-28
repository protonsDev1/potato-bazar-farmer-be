import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  irrigationMethodCreateSchema,
  irrigationMethodUpdateSchema,
} from "../../../validation/adminValidation";
import {
  addIrrigationMethod,
  deleteIrrigationMethod,
  getActiveIrrigationMethod,
  getIrrigationMethod,
  updateIrrigationMethod,
} from "../../../controller/adminController/farmer/irrigationMethodController";
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
  validator.body(irrigationMethodCreateSchema),
  addIrrigationMethod
);

router.get("/", getIrrigationMethod);

router.get("/active", getActiveIrrigationMethod);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(irrigationMethodUpdateSchema),
  updateIrrigationMethod
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteIrrigationMethod
);

export default router;

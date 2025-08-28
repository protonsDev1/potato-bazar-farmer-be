import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { irrigationSourceSchema } from "../../../validation/adminValidation";
import {
  addIrrigationSource,
  deleteIrrigationSource,
  getActiveIrrigationSource,
  getIrrigationSource,
  updateIrrigationSource,
} from "../../../controller/adminController/farmer/irrigationSourceController";
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
  validator.body(irrigationSourceSchema),
  addIrrigationSource
);

router.get("/", getIrrigationSource);

router.get("/active", getActiveIrrigationSource);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateIrrigationSource
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteIrrigationSource
);

export default router;

import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";

import {
  addDryingFacilityDetail,
  deleteDryingFacilityDetail,
  getActiveDryingFacilityDetail,
  getDryingFacilityDetail,
  updateDryingFacilityDetail,
} from "../../../controller/adminController/coldStorage/dryingFacilityDetailController";
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
  validator.body(adminColdStorageSchema),
  addDryingFacilityDetail
);

router.get("/", getDryingFacilityDetail);

router.get("/active", getActiveDryingFacilityDetail);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateDryingFacilityDetail
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteDryingFacilityDetail
);

export default router;

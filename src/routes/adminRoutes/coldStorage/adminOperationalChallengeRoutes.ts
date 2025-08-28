import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addOperationalChallenge,
  deleteOperationalChallenge,
  getActiveOperationalChallenge,
  getOperationalChallenge,
  updateOperationalChallenge,
} from "../../../controller/adminController/coldStorage/operationalChallengeController";
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
  addOperationalChallenge
);

router.get("/", getOperationalChallenge);

router.get("/active", getActiveOperationalChallenge);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateOperationalChallenge
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteOperationalChallenge
);

export default router;

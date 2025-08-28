import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addPotatoDisposalSystem,
  deletePotatoDisposalSystem,
  getActivePotatoDisposalSystem,
  getPotatoDisposalSystem,
  updatePotatoDisposalSystem,
} from "../../../controller/adminController/coldStorage/potatoDisposalSystemController";
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
  addPotatoDisposalSystem
);

router.get("/", getPotatoDisposalSystem);

router.get("/active", getActivePotatoDisposalSystem);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updatePotatoDisposalSystem
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deletePotatoDisposalSystem
);

export default router;

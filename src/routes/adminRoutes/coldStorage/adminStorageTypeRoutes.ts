import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addStorageType,
  deleteStorageType,
  getActiveStorageType,
  getStorageType,
  updateStorageType,
} from "../../../controller/adminController/coldStorage/storageTypeController";
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
  addStorageType
);

router.get("/", getStorageType);

router.get("/active", getActiveStorageType);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateStorageType
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteStorageType
);

export default router;

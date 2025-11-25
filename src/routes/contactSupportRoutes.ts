import express from "express";
import { createValidator } from "express-joi-validation";

import {
  checkPermissionMiddleware,
  optionalAuthMiddleware,
} from "../utils/userAuth";
import { PERMISSIONS } from "../utils/constants/permissions";
import { createContactSupportValidation } from "../validation/contactSupportValidation";
import {
  createContactSupport,
  deleteContactSupport,
  getContactSupportList,
  updateContactSupportStatus,
} from "../controller/contactSupportController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  optionalAuthMiddleware,
  validator.body(createContactSupportValidation),
  createContactSupport
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.CALL_SUPPORT),
  getContactSupportList
);
router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.CALL_SUPPORT),
  deleteContactSupport
);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.CALL_SUPPORT),
  updateContactSupportStatus
);

export default router;

import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  potatoTypeCreateSchema,
  potatoTypeUpdateSchema,
} from "../../../validation/adminValidation";
import {
  addPotatoType,
  deletePotatoType,
  getActivePotatoType,
  getPotatoType,
  updatePotatoType,
} from "../../../controller/adminController/farmer/potatoTypeController";
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
  validator.body(potatoTypeCreateSchema),
  addPotatoType
);

router.get("/", getPotatoType);

router.get("/active", getActivePotatoType);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(potatoTypeUpdateSchema),
  updatePotatoType
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deletePotatoType
);

export default router;

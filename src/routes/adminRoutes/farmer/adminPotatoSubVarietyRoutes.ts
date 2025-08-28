import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { potatoSubVarietySchema } from "../../../validation/adminValidation";
import {
  addPotatoSubVarietyGrown,
  deletePotatoSubVariety,
  getActivePotatoSubVarietyGrown,
  getPotatoSubVarietyGrown,
  updatePotatoSubVariety,
} from "../../../controller/adminController/farmer/potatoSubVarietyController";
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
  validator.body(potatoSubVarietySchema),
  addPotatoSubVarietyGrown
);

router.get("/", getPotatoSubVarietyGrown);

router.get("/active", getActivePotatoSubVarietyGrown);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updatePotatoSubVariety
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deletePotatoSubVariety
);
export default router;

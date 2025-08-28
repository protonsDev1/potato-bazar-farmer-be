import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { potatoVarietySchema } from "../../../validation/adminValidation";
import {
  addPotatoVarietyGrown,
  deletePotatoVariety,
  getActivePotatoVarietyGrown,
  getPotatoVarietyGrown,
  updatePotatoVariety,
} from "../../../controller/adminController/farmer/potatoVarietyController";
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
  validator.body(potatoVarietySchema),
  addPotatoVarietyGrown
);

router.get("/", getPotatoVarietyGrown);

router.get("/active", getActivePotatoVarietyGrown);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updatePotatoVariety
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deletePotatoVariety
);

export default router;

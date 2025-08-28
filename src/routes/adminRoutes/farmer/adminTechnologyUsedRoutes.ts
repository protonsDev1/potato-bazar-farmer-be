import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { technologyUsedSchema } from "../../../validation/adminValidation";
import {
  addTechnologyUsed,
  deleteTechnologyUsed,
  getActiveTechnologyUsed,
  getTechnologyUsed,
  updateTechnologyUsed,
} from "../../../controller/adminController/farmer/technologyUsedController";
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
  validator.body(technologyUsedSchema),
  addTechnologyUsed
);

router.get("/", getTechnologyUsed);

router.get("/active", getActiveTechnologyUsed);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateTechnologyUsed
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteTechnologyUsed
);

export default router;

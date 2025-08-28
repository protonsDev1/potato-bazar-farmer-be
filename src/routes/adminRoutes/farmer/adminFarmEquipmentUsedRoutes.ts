import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { farmEquipmentUsedSchema } from "../../../validation/adminValidation";
import {
  addFarmEquipment,
  deleteFarmEquipment,
  getActiveFarmEquipment,
  getFarmEquipment,
  updateFarmEquipment,
} from "../../../controller/adminController/farmer/farmEquipmentUsed";
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
  validator.body(farmEquipmentUsedSchema),
  addFarmEquipment
);

router.get("/", getFarmEquipment);

router.get("/active", getActiveFarmEquipment);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updateFarmEquipment
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteFarmEquipment
);

export default router;

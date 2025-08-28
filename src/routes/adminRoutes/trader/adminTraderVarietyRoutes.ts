import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addTraderVariety,
  deleteTraderVariety,
  getActiveTraderVarieties,
  getTraderVarieties,
  getTraderVarietyById,
  updateTraderVariety,
} from "../../../controller/adminController/trader/traderVarietyController";
import {
  traderVarietyCreateSchema,
  traderVarietyUpdateSchema,
} from "../../../validation/adminTraderValidation";
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
  validator.body(traderVarietyCreateSchema),
  addTraderVariety
);

router.get("/", getTraderVarieties);

router.get("/active", getActiveTraderVarieties);

router.get("/:id", getTraderVarietyById);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(traderVarietyUpdateSchema),
  updateTraderVariety
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteTraderVariety
);

export default router;

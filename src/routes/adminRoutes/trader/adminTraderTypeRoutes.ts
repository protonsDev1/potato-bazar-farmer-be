import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addTraderType,
  deleteTraderType,
  getTraderTypes,
  getTraderTypeById,
  updateTraderType,
  getActiveTraderTypes,
} from "../../../controller/adminController/trader/traderTypeController";
import {
  traderTypeCreateSchema,
  traderTypeUpdateSchema,
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
  validator.body(traderTypeCreateSchema),
  addTraderType
);

router.get("/", getTraderTypes);

router.get("/active", getActiveTraderTypes);

router.get("/:id", getTraderTypeById);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(traderTypeUpdateSchema),
  updateTraderType
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteTraderType
);

export default router;

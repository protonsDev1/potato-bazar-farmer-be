import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addTraderInterest,
  deleteTraderInterest,
  getTraderInterests,
  getTraderInterestById,
  updateTraderInterest,
  getActiveTraderInterests,
} from "../../../controller/adminController/trader/traderInterestController";
import {
  traderInterestCreateSchema,
  traderInterestUpdateSchema,
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
  validator.body(traderInterestCreateSchema),
  addTraderInterest
);

router.get("/", getTraderInterests);

router.get("/active", getActiveTraderInterests);

router.get("/:id", getTraderInterestById);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(traderInterestUpdateSchema),
  updateTraderInterest
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteTraderInterest
);

export default router;

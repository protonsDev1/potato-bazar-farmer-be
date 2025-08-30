import { createValidator } from "express-joi-validation";
import express from "express";
import {
  adminMiddleware,
  adminOrSubAdminMiddleware,
  authMiddleware,
  checkWebPermissionMiddleware,
} from "../utils/userAuth";
import {
  createTrader,
  deleteTrader,
  exportTraders,
  getTraderList,
  getTraderProfileOverview,
  selfOnboardedTrader,
  updateTrader,
} from "../controller/traderController";
import {
  onboardTraderSchema,
  updateTraderSchema,
} from "../validation/traderValidation";
import { verifyOtpSchema } from "../validation/userValidator";
import { WEB_ACTIONS, WEB_MODULES } from "../utils/constants/permissions";
import { duplicationCheckMiddleware } from "../middlewares/duplicationCheckMiddleware";
import Trader from "../database/models/trader/trader";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  checkWebPermissionMiddleware(WEB_MODULES.TRADER, WEB_ACTIONS.CREATE, true),
  validator.body(onboardTraderSchema),
  duplicationCheckMiddleware(Trader, "create"),
  createTrader
);

router.post(
  "/self_onboard",
  validator.body(onboardTraderSchema),
  duplicationCheckMiddleware(Trader, "create"),
  selfOnboardedTrader
);

router.put(
  "/update/:traderId",
  checkWebPermissionMiddleware(WEB_MODULES.TRADER, WEB_ACTIONS.UPDATE, true),
  validator.body(updateTraderSchema),
  duplicationCheckMiddleware(Trader, "update", "traderId"),
  updateTrader
);

router.get(
  "/profile/:traderId",
  checkWebPermissionMiddleware(WEB_MODULES.TRADER, WEB_ACTIONS.VIEW, true),
  getTraderProfileOverview
);

router.get("/", adminOrSubAdminMiddleware, getTraderList);

router.delete(
  "/delete/:id",
  checkWebPermissionMiddleware(WEB_MODULES.TRADER, WEB_ACTIONS.DELETE, false),
  deleteTrader
);

router.post(
  "/export",
  validator.body(verifyOtpSchema),
  adminMiddleware,
  exportTraders
);

export default router;

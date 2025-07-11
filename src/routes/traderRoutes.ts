import { createValidator } from "express-joi-validation";
import express from "express";
import { adminMiddleware, authMiddleware } from "../utils/userAuth";
import {
  createTrader,
  getTraderList,
  getTraderProfileOverview,
  selfOnboardedTrader,
  updateTrader,
} from "../controller/traderController";
import {
  onboardTraderSchema,
  updateTraderSchema,
} from "../validation/traderValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(onboardTraderSchema),
  createTrader
);

router.post(
  "/self_onboard",
  validator.body(onboardTraderSchema),
  selfOnboardedTrader
);

router.put(
  "/update/:traderId",
  authMiddleware,
  validator.body(updateTraderSchema),
  updateTrader
);

router.get("/profile/:traderId", authMiddleware, getTraderProfileOverview);

router.get("/", adminMiddleware, getTraderList);

export default router;

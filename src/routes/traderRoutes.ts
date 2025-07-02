import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../utils/userAuth";
import {
  createTrader,
  getTraderProfileOverview,
  selfOnboardedTrader,
} from "../controller/traderController";
import { onboardTraderSchema } from "../validation/traderValidation";

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

router.get("/profile/:traderId", authMiddleware, getTraderProfileOverview);

export default router;

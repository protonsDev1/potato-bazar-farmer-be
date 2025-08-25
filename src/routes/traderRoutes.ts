import { createValidator } from "express-joi-validation";
import express from "express";
import { adminMiddleware, authMiddleware } from "../utils/userAuth";
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

router.delete("/delete/:id", adminMiddleware, deleteTrader);

router.post(
  "/export",
  validator.body(verifyOtpSchema),
  adminMiddleware,
  exportTraders
);

export default router;

import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../utils/userAuth";
import {
  createTrader,
  getTraderProfileOverview,
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
router.get("/profile/:traderId", authMiddleware, getTraderProfileOverview);

export default router;

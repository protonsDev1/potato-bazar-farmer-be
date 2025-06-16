import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../utils/userAuth";
import { createTrader } from "../controller/traderController";
import { onboardTraderSchema } from "../validation/traderValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/create",
  authMiddleware,
  validator.body(onboardTraderSchema),
  createTrader
);

export default router;

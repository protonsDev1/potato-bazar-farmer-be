import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
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

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(traderInterestCreateSchema),
  addTraderInterest
);

router.get("/", authMiddleware, getTraderInterests);

router.get("/active", authMiddleware, getActiveTraderInterests);

router.get("/:id", authMiddleware, getTraderInterestById);

router.put(
  "/:id",
  authMiddleware,
  validator.body(traderInterestUpdateSchema),
  updateTraderInterest
);

router.delete("/:id", authMiddleware, deleteTraderInterest);

export default router;

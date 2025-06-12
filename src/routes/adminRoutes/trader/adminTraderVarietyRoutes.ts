import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
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

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(traderVarietyCreateSchema),
  addTraderVariety
);

router.get("/", authMiddleware, getTraderVarieties);

router.get("/active", authMiddleware, getActiveTraderVarieties);

router.get("/:id", authMiddleware, getTraderVarietyById);

router.put(
  "/:id",
  authMiddleware,
  validator.body(traderVarietyUpdateSchema),
  updateTraderVariety
);

router.delete("/:id", authMiddleware, deleteTraderVariety);

export default router;

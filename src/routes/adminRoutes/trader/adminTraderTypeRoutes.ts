import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
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

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(traderTypeCreateSchema),
  addTraderType
);

router.get("/", authMiddleware, getTraderTypes);

router.get("/active", authMiddleware, getActiveTraderTypes);

router.get("/:id", authMiddleware, getTraderTypeById);

router.put(
  "/:id",
  authMiddleware,
  validator.body(traderTypeUpdateSchema),
  updateTraderType
);

router.delete("/:id", authMiddleware, deleteTraderType);

export default router;

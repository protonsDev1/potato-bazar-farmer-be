import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addCropTraded,
  deleteCropTraded,
  getActiveCropsTraded,
  getCropsTraded,
  getCropTradedById,
  updateCropTraded,
} from "../../../controller/adminController/trader/cropTradedController";
import {
  cropTradedCreateSchema,
  cropTradedUpdateSchema,
} from "../../../validation/adminTraderValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(cropTradedCreateSchema),
  addCropTraded
);

router.get("/", authMiddleware, getCropsTraded);

router.get("/active", authMiddleware, getActiveCropsTraded);

router.get("/:id", authMiddleware, getCropTradedById);

router.put(
  "/:id",
  authMiddleware,
  validator.body(cropTradedUpdateSchema),
  updateCropTraded
);

router.delete("/:id", authMiddleware, deleteCropTraded);

export default router;

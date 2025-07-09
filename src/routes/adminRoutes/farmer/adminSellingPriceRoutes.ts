import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  addSellingPrice,
  deleteSellingPrice,
  getActiveSellingPrice,
  getSellingPrice,
  updateSellingPrice,
} from "../../../controller/adminController/farmer/sellingPriceController";
import { createValidator } from "express-joi-validation";
import {
  sellingPriceCreateSchema,
  sellingPriceUpdateSchema,
} from "../../../validation/adminValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(sellingPriceCreateSchema),
  addSellingPrice
);
router.get("/", authMiddleware, getSellingPrice);
router.get("/active", getActiveSellingPrice);
router.put(
  "/:id",
  authMiddleware,
  validator.body(sellingPriceUpdateSchema),
  updateSellingPrice
);
router.delete("/:id", authMiddleware, deleteSellingPrice);

export default router;

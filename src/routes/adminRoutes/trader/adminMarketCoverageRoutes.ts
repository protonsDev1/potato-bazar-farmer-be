import { createValidator } from "express-joi-validation";
import express from "express";
import { authMiddleware } from "../../../utils/userAuth";
import {
  marketCoverageCreateSchema,
  marketCoverageUpdateSchema,
} from "../../../validation/adminTraderValidation";
import {
  addMarketCoverage,
  deleteMarketCoverage,
  getActiveMarketCoverages,
  getMarketCoverageById,
  getMarketCoverages,
  updateMarketCoverage,
} from "../../../controller/adminController/trader/marketCoverageController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(marketCoverageCreateSchema),
  addMarketCoverage
);

router.get("/", authMiddleware, getMarketCoverages);

router.get("/active", getActiveMarketCoverages);

router.get("/:id", authMiddleware, getMarketCoverageById);

router.put(
  "/:id",
  authMiddleware,
  validator.body(marketCoverageUpdateSchema),
  updateMarketCoverage
);

router.delete("/:id", authMiddleware, deleteMarketCoverage);

export default router;

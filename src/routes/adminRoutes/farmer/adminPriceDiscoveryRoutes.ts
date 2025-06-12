import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { priceDiscoverySchema } from "../../../validation/adminValidation";
import {
  addPriceDiscovery,
  deletePriceDiscovery,
  getActivePriceDiscovery,
  getPriceDiscovery,
  updatePriceDiscovery,
} from "../../../controller/adminController/farmer/priceDiscovery";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(priceDiscoverySchema),
  addPriceDiscovery
);

router.get("/", getPriceDiscovery);

router.get("/active", getActivePriceDiscovery);

router.put("/:id", authMiddleware, updatePriceDiscovery);

router.delete("/:id", authMiddleware, deletePriceDiscovery);

export default router;

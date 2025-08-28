import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
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
import { WEB_ACTIONS, WEB_MODULES } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(marketCoverageCreateSchema),
  addMarketCoverage
);

router.get("/", getMarketCoverages);

router.get("/active", getActiveMarketCoverages);

router.get("/:id", getMarketCoverageById);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(marketCoverageUpdateSchema),
  updateMarketCoverage
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteMarketCoverage
);

export default router;

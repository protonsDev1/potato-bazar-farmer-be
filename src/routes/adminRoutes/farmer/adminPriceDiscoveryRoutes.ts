import { createValidator } from "express-joi-validation";
import express from "express";

import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import { priceDiscoverySchema } from "../../../validation/adminValidation";
import {
  addPriceDiscovery,
  deletePriceDiscovery,
  getActivePriceDiscovery,
  getPriceDiscovery,
  updatePriceDiscovery,
} from "../../../controller/adminController/farmer/priceDiscovery";
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
  validator.body(priceDiscoverySchema),
  addPriceDiscovery
);

router.get("/", getPriceDiscovery);

router.get("/active", getActivePriceDiscovery);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  updatePriceDiscovery
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deletePriceDiscovery
);

export default router;

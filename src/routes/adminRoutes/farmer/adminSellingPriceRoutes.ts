import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
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
  validator.body(sellingPriceCreateSchema),
  addSellingPrice
);
router.get("/", getSellingPrice);
router.get("/active", getActiveSellingPrice);
router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(sellingPriceUpdateSchema),
  updateSellingPrice
);
router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteSellingPrice
);

export default router;

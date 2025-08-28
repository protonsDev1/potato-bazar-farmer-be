import { createValidator } from "express-joi-validation";
import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
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
  validator.body(cropTradedCreateSchema),
  addCropTraded
);

router.get("/", getCropsTraded);

router.get("/active", getActiveCropsTraded);

router.get("/:id", getCropTradedById);

router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(cropTradedUpdateSchema),
  updateCropTraded
);

router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteCropTraded
);

export default router;

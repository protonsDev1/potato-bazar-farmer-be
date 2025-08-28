import express from "express";
import { checkWebPermissionMiddleware } from "../../../utils/userAuth";
import {
  addSellingChannel,
  deleteSellingChannel,
  getActiveSellingChannels,
  getSellingChannels,
  updateSellingChannel,
} from "../../../controller/adminController/farmer/sellingChannelController";
import { createValidator } from "express-joi-validation";
import {
  sellingChannelCreateSchema,
  sellingChannelUpdateSchema,
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
  validator.body(sellingChannelCreateSchema),
  addSellingChannel
);
router.get("/", getSellingChannels);
router.get("/active", getActiveSellingChannels);
router.put(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  validator.body(sellingChannelUpdateSchema),
  updateSellingChannel
);
router.delete(
  "/:id",
  checkWebPermissionMiddleware(
    WEB_MODULES.DROPDOWN_MANAGEMENT,
    WEB_ACTIONS.ALL,
    false
  ),
  deleteSellingChannel
);

export default router;

import express from "express";
import { createValidator } from "express-joi-validation";

import { authMiddleware, checkPermissionMiddleware } from "../utils/userAuth";
import {
  createAdvertisementRequest,
  deleteAdvertisementRequest,
  getAllAdvertisementRequestByAdmin,
  updateAdvertisementStatus,
} from "../controller/advertisementController";
import { createAdvertisementRequestValidation } from "../validation/advertisementValidation";
import { PERMISSIONS } from "../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(createAdvertisementRequestValidation),
  createAdvertisementRequest
);
router.get(
  "/",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  getAllAdvertisementRequestByAdmin
);
router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  deleteAdvertisementRequest
);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  updateAdvertisementStatus
);

export default router;

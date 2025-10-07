import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addAdvertisementService,
  deleteAdvertisementService,
  getActiveAdvertisementService,
  getAdvertisementService,
  updateAdvertisementService,
} from "../../../controller/adminController/mobile/advertisementServiceController";
import { PERMISSIONS } from "../../../utils/constants/permissions";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  validator.body(adminColdStorageSchema),
  addAdvertisementService
);

router.get("/", getAdvertisementService);

router.get("/active", getActiveAdvertisementService);

router.put(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  updateAdvertisementService
);

router.delete(
  "/:id",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  deleteAdvertisementService
);

export default router;

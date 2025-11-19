import { createValidator } from "express-joi-validation";
import express from "express";

import { checkPermissionMiddleware } from "../../../utils/userAuth";
import {
  addAdvertisementService,
  deleteAdvertisementService,
  getActiveAdvertisementService,
  getAdvertisementService,
  updateAdvertisementService,
} from "../../../controller/adminController/mobile/advertisementServiceController";
import { PERMISSIONS } from "../../../utils/constants/permissions";
import { createAdvertisementServiceSchema } from "../../../validation/advertisementValidation";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  checkPermissionMiddleware(PERMISSIONS.ADVERTISEMENT),
  validator.body(createAdvertisementServiceSchema),
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

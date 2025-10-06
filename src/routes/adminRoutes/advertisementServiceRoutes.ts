import { createValidator } from "express-joi-validation";
import express from "express";

import { superAdminMiddleware } from "../../utils/userAuth";
import { adminColdStorageSchema } from "../../validation/adminValidation";
import {
  addAdvertisementService,
  deleteAdvertisementService,
  getActiveAdvertisementService,
  getAdvertisementService,
  updateAdvertisementService,
} from "../../controller/adminController/advertisementServiceController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  superAdminMiddleware,
  validator.body(adminColdStorageSchema),
  addAdvertisementService
);

router.get("/", getAdvertisementService);

router.get("/active", getActiveAdvertisementService);

router.put("/:id", superAdminMiddleware, updateAdvertisementService);

router.delete("/:id", superAdminMiddleware, deleteAdvertisementService);

export default router;

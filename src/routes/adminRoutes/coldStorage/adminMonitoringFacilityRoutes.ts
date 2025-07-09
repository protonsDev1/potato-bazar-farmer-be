import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addMonitoringFacility,
  deleteMonitoringFacility,
  getActiveMonitoringFacility,
  getMonitoringFacility,
  updateMonitoringFacility,
} from "../../../controller/adminController/coldStorage/monitoringFacilityController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addMonitoringFacility
);

router.get("/", getMonitoringFacility);

router.get("/active", getActiveMonitoringFacility);

router.put("/:id", authMiddleware, updateMonitoringFacility);

router.delete("/:id", authMiddleware, deleteMonitoringFacility);

export default router;

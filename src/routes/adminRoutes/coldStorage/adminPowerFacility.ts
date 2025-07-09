import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addPowerFacility,
  deletePowerFacility,
  getActivePowerFacility,
  getPowerFacility,
  updatePowerFacility,
} from "../../../controller/adminController/coldStorage/powerFacilityController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addPowerFacility
);

router.get("/", getPowerFacility);

router.get("/active", getActivePowerFacility);

router.put("/:id", authMiddleware, updatePowerFacility);

router.delete("/:id", authMiddleware, deletePowerFacility);

export default router;

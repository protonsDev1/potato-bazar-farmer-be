import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";

import {
  addDryingFacilityDetail,
  deleteDryingFacilityDetail,
  getActiveDryingFacilityDetail,
  getDryingFacilityDetail,
  updateDryingFacilityDetail,
} from "../../../controller/adminController/coldStorage/dryingFacilityDetailController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addDryingFacilityDetail
);

router.get("/", getDryingFacilityDetail);

router.get("/active", getActiveDryingFacilityDetail);

router.put("/:id", authMiddleware, updateDryingFacilityDetail);

router.delete("/:id", authMiddleware, deleteDryingFacilityDetail);

export default router;

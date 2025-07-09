import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addOtherFacility,
  deleteOtherFacility,
  getActiveOtherFacility,
  getOtherFacility,
  updateOtherFacility,
} from "../../../controller/adminController/coldStorage/otherFacilityController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addOtherFacility
);

router.get("/", getOtherFacility);

router.get("/active", getActiveOtherFacility);

router.put("/:id", authMiddleware, updateOtherFacility);

router.delete("/:id", authMiddleware, deleteOtherFacility);

export default router;

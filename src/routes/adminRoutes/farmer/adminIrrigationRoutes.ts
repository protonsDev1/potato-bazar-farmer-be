import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { irrigationSourceSchema } from "../../../validation/adminValidation";
import {
  addIrrigationSource,
  deleteIrrigationSource,
  getActiveIrrigationSource,
  getIrrigationSource,
  updateIrrigationSource,
} from "../../../controller/adminController/farmer/irrigationSourceController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(irrigationSourceSchema),
  addIrrigationSource
);

router.get("/", getIrrigationSource);

router.get("/active", getActiveIrrigationSource);

router.put("/:id", authMiddleware, updateIrrigationSource);

router.delete("/:id", authMiddleware, deleteIrrigationSource);

export default router;

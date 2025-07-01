import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import {
  irrigationMethodCreateSchema,
  irrigationMethodUpdateSchema,
} from "../../../validation/adminValidation";
import {
  addIrrigationMethod,
  deleteIrrigationMethod,
  getActiveIrrigationMethod,
  getIrrigationMethod,
  updateIrrigationMethod,
} from "../../../controller/adminController/farmer/irrigationMethodController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(irrigationMethodCreateSchema),
  addIrrigationMethod
);

router.get("/", getIrrigationMethod);

router.get("/active", getActiveIrrigationMethod);

router.put(
  "/:id",
  authMiddleware,
  validator.body(irrigationMethodUpdateSchema),
  updateIrrigationMethod
);

router.delete("/:id", authMiddleware, deleteIrrigationMethod);

export default router;

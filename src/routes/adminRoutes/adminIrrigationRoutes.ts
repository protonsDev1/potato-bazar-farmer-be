import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../utils/userAuth";
import { irrigationSourceSchema } from "../../validation/adminValidation";
import {
  addIrrigationSource,
  deleteIrrigationSource,
  getIrrigationSource,
  updateIrrigationSource,
} from "../../controller/adminController/irrigationSourceController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(irrigationSourceSchema),
  addIrrigationSource
);

router.get("/", getIrrigationSource);

router.put("/:id", authMiddleware, updateIrrigationSource);

router.delete("/:id", authMiddleware, deleteIrrigationSource);

export default router;

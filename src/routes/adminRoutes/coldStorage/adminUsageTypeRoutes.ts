import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { usageTypeSchema } from "../../../validation/adminValidation";
import {
  addUsageType,
  deleteUsageType,
  getActiveUsageType,
  getUsageType,
  updateUsageType,
} from "../../../controller/adminController/coldStorage/usageTypeController";

const router = express.Router();
const validator = createValidator({});

router.post("/", authMiddleware, validator.body(usageTypeSchema), addUsageType);

router.get("/", getUsageType);

router.get("/active", getActiveUsageType);

router.put("/:id", authMiddleware, updateUsageType);

router.delete("/:id", authMiddleware, deleteUsageType);

export default router;

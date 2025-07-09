import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addColdStorageType,
  deleteColdStorageType,
  getActiveColdStorageType,
  getColdStorageType,
  updateColdStorageType,
} from "../../../controller/adminController/coldStorage/coldStorageTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addColdStorageType
);

router.get("/", getColdStorageType);

router.get("/active", getActiveColdStorageType);

router.put("/:id", authMiddleware, updateColdStorageType);

router.delete("/:id", authMiddleware, deleteColdStorageType);

export default router;

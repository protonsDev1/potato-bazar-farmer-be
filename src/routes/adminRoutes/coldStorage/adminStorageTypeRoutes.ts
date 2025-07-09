import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addStorageType,
  deleteStorageType,
  getActiveStorageType,
  getStorageType,
  updateStorageType,
} from "../../../controller/adminController/coldStorage/storageTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addStorageType
);

router.get("/", getStorageType);

router.get("/active", getActiveStorageType);

router.put("/:id", authMiddleware, updateStorageType);

router.delete("/:id", authMiddleware, deleteStorageType);

export default router;

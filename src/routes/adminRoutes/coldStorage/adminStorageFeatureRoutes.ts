import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addStorageFeature,
  deleteStorageFeature,
  getActiveStorageFeature,
  getStorageFeature,
  updateStorageFeature,
} from "../../../controller/adminController/coldStorage/storageFeatureController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addStorageFeature
);

router.get("/", getStorageFeature);

router.get("/active", getActiveStorageFeature);

router.put("/:id", authMiddleware, updateStorageFeature);

router.delete("/:id", authMiddleware, deleteStorageFeature);

export default router;

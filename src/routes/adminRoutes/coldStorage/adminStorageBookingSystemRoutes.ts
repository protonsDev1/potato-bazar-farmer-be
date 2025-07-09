import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addStorageBookingSystem,
  deleteStorageBookingSystem,
  getActiveStorageBookingSystem,
  getStorageBookingSystem,
  updateStorageBookingSystem,
} from "../../../controller/adminController/coldStorage/storageBookingSystemController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addStorageBookingSystem
);

router.get("/", getStorageBookingSystem);

router.get("/active", getActiveStorageBookingSystem);

router.put("/:id", authMiddleware, updateStorageBookingSystem);

router.delete("/:id", authMiddleware, deleteStorageBookingSystem);

export default router;

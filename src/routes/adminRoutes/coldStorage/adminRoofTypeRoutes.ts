import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addRoofType,
  deleteRoofType,
  getActiveRoofType,
  getRoofType,
  updateRoofType,
} from "../../../controller/adminController/coldStorage/roofTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addRoofType
);

router.get("/", getRoofType);

router.get("/active", getActiveRoofType);

router.put("/:id", authMiddleware, updateRoofType);

router.delete("/:id", authMiddleware, deleteRoofType);

export default router;

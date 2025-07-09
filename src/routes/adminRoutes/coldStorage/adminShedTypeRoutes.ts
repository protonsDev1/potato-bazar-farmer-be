import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addShedType,
  deleteShedType,
  getActiveShedType,
  getShedType,
  updateShedType,
} from "../../../controller/adminController/coldStorage/shedTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addShedType
);

router.get("/", getShedType);

router.get("/active", getActiveShedType);

router.put("/:id", authMiddleware, updateShedType);

router.delete("/:id", authMiddleware, deleteShedType);

export default router;

import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { adminColdStorageSchema } from "../../../validation/adminValidation";
import {
  addElevatorType,
  deleteElevatorType,
  getActiveElevatorType,
  getElevatorType,
  updateElevatorType,
} from "../../../controller/adminController/coldStorage/elevatorTypeController";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(adminColdStorageSchema),
  addElevatorType
);

router.get("/", getElevatorType);

router.get("/active", getActiveElevatorType);

router.put("/:id", authMiddleware, updateElevatorType);

router.delete("/:id", authMiddleware, deleteElevatorType);

export default router;

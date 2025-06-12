import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { farmEquipmentUsedSchema } from "../../../validation/adminValidation";
import {
  addFarmEquipment,
  deleteFarmEquipment,
  getFarmEquipment,
  UpdateFarmEquipment,
} from "../../../controller/adminController/farmer/farmEquipmentUsed";

const router = express.Router();
const validator = createValidator({});

router.post(
  "/",
  authMiddleware,
  validator.body(farmEquipmentUsedSchema),
  addFarmEquipment
);

router.get("/", getFarmEquipment);

router.put("/:id", authMiddleware, UpdateFarmEquipment);

router.delete("/:id", authMiddleware, deleteFarmEquipment);

export default router;

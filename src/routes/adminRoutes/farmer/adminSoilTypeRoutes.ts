import { createValidator } from "express-joi-validation";
import express from "express";

import { authMiddleware } from "../../../utils/userAuth";
import { soilTypeSchema } from "../../../validation/adminValidation";
import {
  addSoilType,
  deleteSoilType,
  getActiveSoilType,
  getSoilType,
  updateSoilType,
} from "../../../controller/adminController/farmer/soilTypeController";

const router = express.Router();
const validator = createValidator({});

router.post("/", authMiddleware, validator.body(soilTypeSchema), addSoilType);

router.get("/", getSoilType);

router.get("/active", getActiveSoilType);

router.put("/:id", authMiddleware, updateSoilType);

router.delete("/:id", authMiddleware, deleteSoilType);

export default router;
